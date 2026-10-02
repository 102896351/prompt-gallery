---
title: "How to Write AI Art Prompts: The Complete Beginner's Guide"
description: A practical framework for writing AI image-generation prompts that actually work — subject, style, composition, lighting, and aspect ratio, with copy-paste examples and a free in-browser generator.
pubDate: 2026-10-02
topic: Guides
cover: https://media.aiartspell.art/images/prompts/20251219/nano-banana-pro-front-view-1.jpg
readingTime: 9 min
draft: false
---

You don't need to be an artist to get great AI images. You need to be **specific**. A good prompt is simply a clear description of a picture you already see in your head — written in a way the model can follow. This guide gives you a repeatable framework, copy-paste examples, and a place to practice without installing anything.

If you want to skip straight to generating, our [free AI image generator](/tools/agnes-image/) runs in your browser. But spend five minutes on the framework first; it's the difference between "meh" and "wow."

## Why the prompt matters more than the model

People obsess over which model is "best." In practice, a well-structured prompt on a decent model beats a vague prompt on the most advanced model every time. Models don't read minds — they follow the words you give them. The same scene described loosely versus precisely can look like two different artists made it.

The good news: prompt writing is a **skill**, not a talent. Once you internalize the structure below, you'll write strong prompts in seconds.

## The 5-part framework

Every strong prompt answers five questions. We call them the five keys: **subject, style, composition, lighting, and aspect ratio.**

1. **Subject** — who or what is in the frame
2. **Style** — the visual language (photorealistic, cinematic, watercolor…)
3. **Composition** — how the shot is framed
4. **Lighting** — the single biggest quality lever
5. **Aspect ratio** — match the destination (square, wallpaper, story)

Let's take each one apart.

### 1. Subject — be specific about the star of the image

Vague subjects produce generic results. The fix is concrete detail.

- ❌ "a cat"
- ✅ "a fluffy orange tabby cat with green eyes, sleeping on a velvet cushion, paws tucked under"

Name the subject, its key attributes, and what it's doing. For people, add age range, expression, clothing, and pose. For objects, name the material and condition ("worn brass," "matte black").

### 2. Style — pick one visual language

Style tells the model *how* to render the subject. Browse our [curated prompt library](/ai-image-prompts/) to see how different styles change the same idea. Common, reliable style words:

- **Photorealistic / cinematic** — looks like a photo
- **Watercolor / oil painting** — traditional art media
- **3D render** — clean, dimensional, often product- or character-like
- **Anime / concept art** — stylized illustration

Pick **one** style family. Mixing "photorealistic anime oil painting" dilutes attention and produces mush.

### 3. Composition — control the framing

Composition decides what the viewer's eye lands on. Useful words: close-up, medium shot, wide shot, top-down, rule of thirds, centered, leading lines, negative space. For portraits, "close-up, shallow depth of field" separates the subject from a soft background. For environments, "wide shot" shows the whole scene.

### 4. Lighting — the biggest quality lever

If you change only one thing, change the lighting. Specific, motivated light beats vague "well-lit."

- **Golden hour** — warm, soft, directional; great for portraits and landscapes
- **Studio softbox** — even, professional; the product-shot default
- **Rim light** — a bright edge that separates a subject from the background
- **Overcast daylight** — soft and diffused, flattering for faces

Avoid "bright lighting" or "well-lit" — those encourage flat, artificial-looking images.

### 5. Aspect ratio — match where the image will live

- **1:1** — social posts, avatars, prints
- **16:9** — wallpapers, banners, presentations
- **9:16** — stories, phone backgrounds, reels

Setting this up front saves you from cropping later.

## A real prompt, taken apart

Here's a complete example using the framework:

> A distinguished professor in his sixties with silver hair and round spectacles, wearing a tweed jacket with leather elbow patches, slight thoughtful smile — **(subject)**
> rendered as a classic oil painting with visible brushstrokes and rich, muted colors — **(style)**
> medium shot, centered composition, soft vignette — **(composition)**
> lit by warm Rembrandt lighting from the left, deep shadows on the right — **(lighting)**
> 4:5 portrait aspect ratio — **(aspect ratio)**

Notice the order: subject first, then style, then the camera and light. Models weight earlier words more, so front-load what must be right.

## Advanced tricks that actually help

Once the basics click, these three upgrades move you from good to great.

**Reusable templates with `[INSERT …]` brackets.** Mark the variable parts so one prompt becomes a fill-in-the-blank system: *"A product photograph of [PRODUCT] on [SURFACE], [LIGHTING], ultra-sharp focus."* Change only the brackets each time.

**Negative constraints.** Most models let you list what to avoid. A safe default: `avoid: watermark, extra text, duplicated limbs, oversaturated colors`. For portraits add `extra fingers, deformed face`.

**JSON-structured prompts for complex scenes.** When a scene has many moving parts (a poster with exact text, a character sheet, a diorama), a structured prompt beats a wall of prose. We keep many structured examples in our [collections](/collections/), including a [portrait and abstract character set](/collections/collection-03/) you can study.

## Common mistakes

- **Keyword soup.** A list of 40 adjectives ("masterpiece, 8k, ultra-detailed, trending…") with no scene reads as noise. Write prose, not a tag dump.
- **Two competing styles.** "Photorealistic anime oil painting" fights itself.
- **Vague lighting.** "Well-lit" is the fastest route to the plastic "AI look."
- **No reason for background objects.** Every element should earn its place.

## Try it now

Open our [free AI image generator](/tools/agnes-image/) and paste a prompt built from the five keys. Start simple — subject + style + lighting — then add composition and aspect ratio. If you're stuck for ideas, the [abstract minimalist portrait collection](/collections/collection-01/) and the [Nano Banana Pro tech and sci-fi set](/collections/collection-02/) are full of copy-paste starting points.

## Frequently asked questions

**Do I need to write prompts in English?** Most models were trained primarily on English, so English prompts often follow instructions more reliably. Our library keeps original prompt text and translates only the surrounding UI.

**How long should a prompt be?** Aim for the sweet spot: enough detail to guide, not so much it confuses. Roughly 30–80 words for most models. One coherent scene, as much concrete detail as you can supply.

**Why do my people look plastic?** Usually missing texture and specific light. Add "natural skin texture," name a camera or film stock, and specify directional lighting instead of "bright."

**Can I edit an image instead of regenerating?** Yes — many modern models accept an uploaded image and a change instruction. Describe what to keep and what to modify, and avoid extra objects or text overlays.

## Wrap-up

Great prompts aren't magic; they're specific. Lead with the subject, choose one style, frame it, light it deliberately, and set the aspect ratio. Practice with the [generator](/tools/agnes-image/), steal structure from the [collections](/collections/), and you'll be producing images you're proud of within an afternoon.
