# Kathana Event Mini v0.8 — Offline Windows clock

**35 skins · Mini 248px · Regular 312px · PH UTC+8 and UTC−3 server-schedule clock · 12-hour time.**

[Download verified ZIP](downloads/Kathana-Event-Mini-v0.8.zip) · [Project webpage](index.html) · [ELI5 skin guide](SKINS-ELI5.md)

## Install in 30 seconds

1. Download the ZIP and choose **Extract All** in Windows File Explorer.
2. Open the extracted Kathana-Event-Mini-v0.8 folder.
3. Double-click **Launch Kathana Widget.bat**. Microsoft Edge on Windows 10/11 is required; do not run as administrator.
4. Click **MINI** for 248px content or **REGULAR** for 312px. Close normally with the X to save the outer Windows size and position.
5. Click **SKINS** for 35 colors or the built-in skin workshop; use **EVENTS** to inspect schedule details.

The main BAT launcher restores your last window size and position. Dedicated Mini and Regular launchers intentionally open their respective layouts instead. A troubleshooting launcher is included.

## Accuracy and privacy

The 'server' clock is a fixed UTC−3 **display reference**, not an authenticated game server clock. Your Windows computer supplies the actual time. The included event timetable repeats weekly; patches may change it. Check official game notices before important events.

The **offline widget has no ads, accounts, remote JavaScript, analytics, game credentials or network requests**. It stores personal themes locally in its dedicated Edge profile. The launcher verifies SHA-256 hashes of major files before launch; this is not an official code signature. Read SECURITY.md in the downloadable ZIP for limitations.

## Website and download

The binary release is stored in this repository at **downloads/Kathana-Event-Mini-v0.8.zip**. GitHub Pages validates the ZIP by SHA-256 before exposing the browser preview in a temporary deployment directory.

SHA-256: 8c46c8d763c5fa495dd1abdb9bacd9e2921510b8049cbed50aca7939cf4b3f02

The website includes counters for approximate visits, thumbs-up and download clicks. They require separate Cloudflare D1 deployment and show **—** until configured. The **widget itself never sends analytics**.

This independent fan utility is not affiliated with or endorsed by Kathana Online or its publisher.

## GitHub organization

The widget is packaged as an independently maintained **event-mini project directory within the existing Kathana fan tools repository**. The current GitHub connector can modify existing repositories but cannot provision an entirely new standalone repository. The owner can later create a separate repository and move this directory.

No open-source license is implied; the repository owner must choose one before encouraging redistribution or forks.
