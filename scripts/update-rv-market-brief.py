#!/usr/bin/env python3
"""Update the public European and Chinese RV news feed from publisher pages."""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from hashlib import sha256
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
from xml.etree import ElementTree


@dataclass(frozen=True)
class Source:
    name: str
    url: str
    article_path: str
    market: str
    language: str
    rss: bool = False


SOURCES = (
    Source("21RV", "https://www.21rv.com/news/", r"/c/[a-z0-9]+/?", "China", "zh-CN"),
    Source("Aboutcamp BtoB", "https://www.aboutcampbtob.eu/", r"/[a-z0-9]+(?:-[a-z0-9]+){3,}/", "Europe", "en"),
    Source("promobil", "https://www.promobil.de/", r"/(?:wohnwagen/)?(?:neuheiten|weitere-ratgeber)/[^/]+/", "Germany", "de"),
    Source("CIVD", "https://www.civd.de/en/news/", r"/en/news/[^/]+/", "Europe", "en"),
    Source("MotorhomeFun", "https://www.motorhomefun.co.uk/forum/forums/motorhome-chat.18/index.rss", r"/forum/threads/[^/]+/?", "UK", "en", True),
)
TOPICS = re.compile(r"\b(rv|rvs|caravan\w*|motor\s?home\w*|camp(?:er|ing)\w*|leisure vehicle\w*|dometic|truma|thetford|lippert|wohnmobil\w*|reisemobil\w*|wohnwagen\w*|freizeitfahrzeug\w*)\b|房车|旅居车|宿营车|拖挂", re.I)
OUTSIDE_EUROPE = re.compile(r"\b(australia\w*|new zealand|canada|united states|north america|usa)\b", re.I)
VEHICLE_LAUNCH = re.compile(r"\b(launch(?:es|ed)?|introduc\w*|unveil\w*|debut\w*|stellt .+ vor|startet .+ modell|neu:|neuheit)\b|新品|新款|发布|上市|亮相", re.I)
MARKET_EVENT = re.compile(r"\b(registration\w*|sales|production|orders|industry|regulation\w*|dealers?|financial|association|zulassung\w*|produktion|absatz|umsatz)\b|工信部|公告|协会|销量|注册|政策|展会|开业", re.I)
FORUM_PRODUCT = re.compile(r"\b(dometic|waeco|seitz|freshjet|freshlight|fantastic breathe)\b", re.I)
POSITIVE = re.compile(r"\b(recommend\w*|excellent|works well|very quiet|impressed)\b", re.I)
ISSUE = re.compile(r"\b(fault\w*|problem\w*|broken|stopped working|issue\w*|leak\w*|not working)\b", re.I)
DATE = re.compile(r"20\d{2}[-/]\d{1,2}[-/]\d{1,2}")
FEED = Path("market-intelligence/brief.json")
MAX_SOURCE_BYTES = 2_000_000


def clean(value):
    return " ".join(value.split())


def public_url(value, origin):
    candidate = urlsplit(urljoin(origin, value))
    expected = urlsplit(origin)
    if candidate.scheme != "https" or candidate.hostname != expected.hostname or candidate.username or candidate.password:
        return None
    return urlunsplit(("https", expected.netloc, candidate.path, "", ""))


def fetch(url):
    request = Request(url, headers={"User-Agent": "Dometic-RV-Market-Brief/1.0 (+https://github.com/MrMartinPet/Dometic)"})
    with urlopen(request, timeout=12) as response:
        if not public_url(response.geturl(), url):
            raise ValueError("Unexpected publisher redirect")
        body = response.read(MAX_SOURCE_BYTES + 1)
        if len(body) > MAX_SOURCE_BYTES:
            raise ValueError("Publisher response exceeds limit")
        return body.decode(response.headers.get_content_charset() or "utf-8", errors="replace")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.metadata = {}
        self.article_date = ""
        self.anchor = None
        self.title = []
        self.in_title = False
        self.in_article_date = False

    def handle_starttag(self, tag, raw_attrs):
        attrs = dict(raw_attrs)
        if tag == "a":
            self.anchor = (attrs.get("href", ""), [])
        if tag == "meta" and attrs.get("content"):
            key = attrs.get("property") or attrs.get("name") or attrs.get("itemprop")
            if key:
                self.metadata.setdefault(key.lower(), attrs["content"])
        if tag == "h1":
            self.in_title = True
        if tag == "span" and "content-article-preview__published-at" in attrs.get("class", ""):
            self.in_article_date = True

    def handle_data(self, value):
        if self.anchor:
            self.anchor[1].append(value)
        if self.in_title:
            self.title.append(value)
        if self.in_article_date:
            self.article_date += value

    def handle_endtag(self, tag):
        if tag == "a" and self.anchor:
            url, parts = self.anchor
            self.links.append((url, clean(" ".join(parts))))
            self.anchor = None
        if tag == "h1":
            self.in_title = False
        if tag == "span" and self.in_article_date:
            self.in_article_date = False


def as_date(value):
    found = DATE.search(value or "")
    if found:
        try:
            year, month, day = map(int, re.split(r"[-/]", found.group()))
            return date(year, month, day)
        except ValueError:
            return None
    return None


def article_date(page, html):
    for key in ("article:published_time", "datepublished", "date", "pubdate"):
        if published := as_date(page.metadata.get(key)):
            return published
    if published := as_date(page.article_date):
        return published
    match = re.search(r'"datePublished"\s*:\s*"([^"]+)"', html, re.I)
    return as_date(match.group(1)) if match else None


def classify(title):
    if VEHICLE_LAUNCH.search(title) and not MARKET_EVENT.search(title):
        return "launch"
    return "industry"


def make_story(source, url, title, published, category, sentiment=None):
    key = url.rstrip("/") + "|" + category
    story = {
        "id": "story-" + sha256(key.encode()).hexdigest()[:20],
        "category": category,
        "family": "Vehicle market" if category != "feedback" else "Other RV equipment",
        "market": source.market,
        "date": published.isoformat(),
        "title": title[:170],
        "summary": "",
        "links": [{"name": source.name, "url": url}],
    }
    if source.language != "en":
        story["language"] = source.language
    if sentiment:
        story["sentiment"] = sentiment
        story["detail"] = "Public owner discussion. The reported experience belongs to the forum participant."
    return story


def forum_items(source, xml, earliest, today, seen):
    root = ElementTree.fromstring(xml)
    for item in root.findall("./channel/item"):
        title = clean(item.findtext("title", ""))
        url = public_url(item.findtext("link", ""), source.url)
        match = FORUM_PRODUCT.search(title)
        if not match or not url or url.rstrip("/") in seen or not re.fullmatch(source.article_path, urlsplit(url).path):
            continue
        try:
            published = parsedate_to_datetime(item.findtext("pubDate", "")).date()
        except (ValueError, TypeError):
            continue
        positive, issue = bool(POSITIVE.search(title)), bool(ISSUE.search(title))
        if not earliest <= published <= today or not (positive or issue):
            continue
        sentiment = "Mixed" if positive and issue else "Positive" if positive else "Issue reported"
        yield make_story(source, url, title, published, "feedback", sentiment)


def article_items(source, html, earliest, today, seen):
    listing = Page()
    listing.feed(html)
    candidates = {}
    for raw, title in listing.links:
        if not title or not TOPICS.search(title):
            continue
        if source.market != "China" and OUTSIDE_EUROPE.search(title):
            continue
        url = public_url(raw, source.url)
        if url and url.rstrip("/") not in seen and re.fullmatch(source.article_path, urlsplit(url).path):
            candidates.setdefault(url, title)
    def read_article(candidate):
        url, headline = candidate
        try:
            document = fetch(url)
            page = Page()
            page.feed(document)
            published = article_date(page, document)
            if not published or not earliest <= published <= today:
                return None
            title = clean(" ".join(page.title)) or headline
            if source.market != "China" and OUTSIDE_EUROPE.search(title):
                return None
            return make_story(source, url, title, published, classify(title))
        except (ValueError, OSError) as error:
            print(f"{source.name}: article skipped ({type(error).__name__})")
            return None

    with ThreadPoolExecutor(max_workers=4) as pool:
        yield from filter(None, pool.map(read_article, list(candidates.items())[:9]))


def scan(source, earliest, today, seen):
    try:
        document = fetch(source.url)
        parser = forum_items if source.rss else article_items
        return source, list(parser(source, document, earliest, today, seen))
    except (ValueError, OSError, ElementTree.ParseError) as error:
        print(f"{source.name}: source unavailable ({type(error).__name__})")
        return source, None


def canonical(url):
    parsed = urlsplit(url)
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path.rstrip("/"), "", ""))


def main():
    now = datetime.now(timezone.utc)
    today = now.date()
    earliest = today - timedelta(days=3)
    feed = json.loads(FEED.read_text(encoding="utf-8"))
    existing = feed["stories"]
    seen_urls = {canonical(link["url"]) for item in existing for link in item["links"]}
    seen_titles = {clean(item["title"]).casefold() for item in existing}
    with ThreadPoolExecutor(max_workers=len(SOURCES)) as pool:
        results = list(pool.map(lambda source: scan(source, earliest, today, seen_urls), SOURCES))

    additions = []
    counts = {"China": 0, "Europe": 0}
    checks = feed.get("marketChecks", {})
    stamp = now.isoformat()
    for source, items in results:
        if items is None:
            continue
        region = "China" if source.market == "China" else "Europe"
        checks[region] = stamp
        for item in sorted(items, key=lambda story: story["date"], reverse=True):
            url = canonical(item["links"][0]["url"])
            title = clean(item["title"]).casefold()
            if counts[region] == 4 or url in seen_urls or title in seen_titles:
                continue
            seen_urls.add(url)
            seen_titles.add(title)
            counts[region] += 1
            additions.append(item)

    if not any(value == stamp for value in checks.values()):
        raise SystemExit("No publisher was reachable; the previous feed was retained.")

    feed["marketChecks"] = checks
    feed["lastScan"] = stamp
    feed["added"] = len(additions)
    if additions:
        feed["revision"] = today.isoformat()
    # Preserve product comparisons and the editorial starting coverage alongside recent headlines.
    combined = sorted(additions + existing, key=lambda item: item.get("date") or "", reverse=True)
    feed["stories"] = [item for item in combined if item.get("summary") or item.get("comparison")]
    feed["stories"].extend([item for item in combined if not item.get("summary") and not item.get("comparison")][:120])
    FEED.write_text(json.dumps(feed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {counts['Europe']} European and {counts['China']} Chinese headlines.")


if __name__ == "__main__":
    main()
