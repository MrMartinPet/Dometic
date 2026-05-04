# Dometic App Portal

## Syfte
Detta är en enkel appportal. Sidan läser appar från `AppLinks.xlsx` och skapar snygga appkort automatiskt.

## Mappstruktur

```text
AppPortal
  index.html
  AppLinks.xlsx
  bilder
    ErgonomicAnalysis.jpg
    Frekvensanalys.jpg
    Leantool.jpg
    StepTimer.jpg
    Funktionsplaneraren.jpg
```

## Excelstruktur
Excel-filen ska heta exakt:

```text
AppLinks.xlsx
```

Första fliken ska ha exakt dessa tre kolumner:

```text
Appnamn | Beskrivning | Länk
```

Exempel:

```text
StepTimer | Realtidsmätning av cykeltid per processteg. | https://mrmartinpet.github.io/steptimer/
```

## Lägga till en ny app

1. Öppna `AppLinks.xlsx`.
2. Lägg till en ny rad.
3. Fyll i:
   * Appnamn
   * Beskrivning
   * Länk
4. Spara Excel-filen.
5. Lägg en bild i mappen `bilder`.
6. Bilden ska heta exakt samma som appnamnet i Excel plus `.jpg`.

Exempel:

```text
Appnamn i Excel: QualityBoard
Bildnamn: bilder/QualityBoard.jpg
```

## Bildkrav
Rekommenderat format:

```text
16:9
1200 x 675 px
.jpg
```

Bilden ska visa appens viktigaste vy. Undvik hela skärmdumpar med mycket tom yta.

## Lokal test
Om du dubbelklickar på `index.html` kan webbläsaren ibland blockera automatisk läsning av Excel-filen.
Då väljer du `AppLinks.xlsx` manuellt via knappen på sidan.

För bästa lokal test kan du köra sidan via en lokal webbserver, men när sidan ligger på GitHub Pages fungerar läsning av `AppLinks.xlsx` normalt automatiskt.

## GitHub Pages
När allt fungerar:

1. Lägg hela foldern i ditt GitHub repository.
2. Aktivera GitHub Pages.
3. Dela länken till portalen.

