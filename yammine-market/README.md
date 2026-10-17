# Yammine Market · Weekly Deals (Remotion)

Four vertical promo videos for the **"DON'T MISS OUR WEEKLY DEALS IN-STORE"** campaign
at Yammine Market, Mansourieh. 1080x1920, 30 fps, 15 s, built from one template whose
content is driven entirely by props.

| Composition id           | Variant                    | Footage focus                                  | Music        |
| ------------------------ | -------------------------- | ---------------------------------------------- | ------------ |
| `WeeklyDeals-General`    | General in-store deals     | shoppers with trolleys across the aisles       | `upbeat.wav` |
| `WeeklyDeals-Beverages`  | Coffee & beverages         | tea and hot drinks aisle, plant-based drinks   | `upbeat.wav` |
| `WeeklyDeals-Fresh`      | Fresh & grocery            | chilled dairy fridges, everyday staples        | `upbeat.wav` |
| `WeeklyDeals-FlashSale`  | Weekend special flash sale | fast cuts, ticker tape, flashes, harder beat   | `flash.wav`  |

## Timeline

| Time     | Frames  | Scene                                                                                           |
| -------- | ------- | ----------------------------------------------------------------------------------------------- |
| 0–3 s    | 0–89    | **Intro.** Logo pops in, "DON'T MISS" slams in on a red brush banner as the kick drops           |
| 3–8 s    | 90–239  | **Offer.** "OUR WEEKLY DEALS IN-STORE" slides in, floating % OFF badges, light leaks between clips |
| 8–12 s   | 240–359 | **Feature.** "PLENTY OF DEALS / AVAILABLE NOW!" banners, starburst badge pulsing on every beat    |
| 12–15 s  | 360–449 | **Outro.** Logo centred, "VISIT US IN-STORE TODAY!", Yammine Market · Mansourieh                 |

Scenes are joined by a red and charcoal brush wipe that covers the frame at each cut.
The music runs at 120 BPM (one beat every 15 frames), so every cut and pulse is on the beat.

## Structure

```
src/
  index.ts                 registerRoot
  Root.tsx                 registers one <Composition> per variant
  theme.ts                 colours, fonts, frame timings
  types/index.ts           VariantProps, Clip, Badge ...
  data/variants.ts         the 4 variant datasets  <- edit copy, clips, badges here
  compositions/
    WeeklyDeals.tsx        scene sequence, wipes, music and SFX
    scenes/                IntroScene, OfferScene, FeatureScene, OutroScene
  components/
    BrushStroke.tsx        procedural dry-brush shape with paint-on reveal
    Brand.tsx              Logo, CategoryChip, BrushBanner, Ticker
    Badges.tsx             PercentTag, StarBurst, DealBag, FloatingBadge
    KineticText.tsx        PopLetters, SlideLine
    Grunge.tsx             torn charcoal bands, corner slashes, grunge texture
    Transitions.tsx        BrushWipe, LightLeak, Flash
    Footage.tsx            muted clip with Ken Burns push
public/
  footage/                 tone-mapped 1080x1920 clips (see scripts/transcode.sh)
  brand/                   logo-white.png, logo-dark.png (from logo_yammine_gray.ai), grunge.png
  audio/                   original music beds and SFX (see scripts/make_music.py)
  fonts/                   Anton, Montserrat (bundled, no network needed at render time)
```

## Build and render

```bash
cd yammine-market
npm install

# preview and tweak props live
npm run studio

# render one variant
npx remotion render src/index.ts WeeklyDeals-General   out/yammine-general.mp4
npx remotion render src/index.ts WeeklyDeals-Beverages out/yammine-beverages.mp4
npx remotion render src/index.ts WeeklyDeals-Fresh     out/yammine-fresh.mp4
npx remotion render src/index.ts WeeklyDeals-FlashSale out/yammine-flash-sale.mp4

# or all four in a row, mastered for social (recommended)
npm run render:all
```

The `npm run render:*` scripts also run `scripts/master.sh`, which brings the audio to
-14 LUFS / -1 dBTP (Instagram and TikTok loudness) without re-encoding the picture.
A plain `npx remotion render` gives the unmastered mix, which plays about 3 dB louder.

If Remotion cannot download its own headless Chromium (offline or behind a proxy), add
`--browser-executable=/path/to/chrome` to any render command.

## Making a new variant

1. Add an object to `src/data/variants.ts` (copy one of the four and change it).
2. Add it to the `variants` array at the bottom of that file, with a new id.
3. It shows up in the Studio and can be rendered with `npx remotion render src/index.ts <id> out/<file>.mp4`.

Clip slices must fit in their source clip: `start` plus the scene length (intro 3 s,
offer 5 s split across its clips, feature 4 s, outro 3 s) must not pass the clip's end.

## Adding new footage

iPhone footage is HLG HDR; converting it as if it were SDR leaves it grey and flat.
Use the transcode script, which tone-maps to BT.709 and crops to 1080x1920:

```bash
scripts/transcode.sh IMG_1234.mov public/footage/new-aisle.mp4
```

## Regenerating assets

```bash
python3 scripts/make_music.py     # public/audio/*.wav
python3 scripts/make_textures.py  # public/brand/grunge.png
```
