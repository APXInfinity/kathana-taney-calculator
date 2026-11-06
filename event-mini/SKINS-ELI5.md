# ELI5 — Make your own Kathana Event Mini skin

**No programming required.** The widget already comes with **35 built-in skins**. You can save **up to 50 personal themes**.

## Make a skin in one minute

1. Open the widget by double-clicking **Launch Kathana Widget.bat**.
2. Click **SKINS** in the bottom toolbar.
3. Pick an existing theme close to your taste.
4. Scroll down to **MAKE YOUR OWN SKIN**.
5. Type your skin name, for example **Blue Dragon**.
6. Click each color box to change that part.
7. Click **SAVE & USE**. It saves locally on the PC.

## Nine color boxes explained

| Name | What it affects |
|---|---|
| bg | Outer widget body |
| panel | Panel backgrounds |
| edge | Lines and borders |
| accent | Clock digits and highlights |
| text | Main lettering |
| muted | Small labels and secondary text |
| screen | Digital clock background |
| button | Menu buttons |
| top | Top title bar |

**Beginner tip:** A bright accent on a very dark screen makes the clock easiest to read. Test your colors in Mini mode too.

## Send your design to a friend

Choose your theme and click **EXPORT CURRENT SKIN**. This downloads a small JSON file.

Your friend clicks **SKINS → IMPORT A SKIN JSON** and selects that file.

**Never send executable BAT, PS1, EXE or JS files as skins.** The widget accepts only properly formatted JSON data, not scripts.

## Copy-and-paste skin recipe

In Notepad, save the following as **BlueDragon.json** using Save as type **All Files**. Then import it.

    {
      "name": "Blue Dragon",
      "bg": "#142039",
      "panel": "#1D3357",
      "edge": "#42678A",
      "accent": "#73D9FF",
      "text": "#E9F5FF",
      "muted": "#B0C8DD",
      "screen": "#08152B",
      "button": "#294D77",
      "top": "#15294B"
    }

You need **all nine color names**, and every color is a hash sign plus six hexadecimal digits.

If the import fails, check double quotes, commas and spelling. If the clock is hard to read, change **accent** and **screen** to contrasting colors. Skins stay on the computer where you created them, so export them before wiping the browser profile.

The downloadable ZIP includes the complete expanded SKINS-ELI5.md and README.md manuals.
