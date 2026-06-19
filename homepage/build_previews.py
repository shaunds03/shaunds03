#!/usr/bin/env python3
"""Regenerate all section previews + the combined homepage preview from the
source CSS/HTML/JS files, so previews never drift from the modules."""
import re
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def read(*parts):
    with open(os.path.join(ROOT, *parts), encoding="utf-8") as f:
        return f.read()


def write(rel, content):
    with open(os.path.join(ROOT, rel), "w", encoding="utf-8") as f:
        f.write(content)


def strip_leading_html_comment(html):
    return re.sub(r"^\s*<!--.*?-->\s*", "", html, count=1, flags=re.S).strip()


def standalone(title, css, html, js=None):
    script = "\n<script>\n" + js + "\n</script>" if js else ""
    return (
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n"
        "<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        f"<title>{title}</title>\n<style>\nhtml, body {{ margin: 0; }}\n{css}\n</style>\n"
        f"</head>\n<body>\n{strip_leading_html_comment(html)}{script}\n</body>\n</html>\n"
    )


# --- sources ---
hero_css, hero_html, hero_js = read("hero", "snoooz-hero.css"), read("hero", "snoooz-hero.html"), read("hero", "snoooz-hero.js")
logo_css, logo_html = read("social-proof", "snoooz-logos.css"), read("social-proof", "snoooz-logos.html")
prob_css, prob_html, prob_js = read("problem", "snoooz-problem.css"), read("problem", "snoooz-problem.html"), read("problem", "snoooz-problem.js")

# --- standalone section previews ---
write("hero/snoooz-hero-preview.html", standalone("Snoooz — Hero preview", hero_css, hero_html, hero_js))
write("social-proof/snoooz-logos-preview.html", standalone("Snoooz — Logo wall preview", logo_css, logo_html))
write("problem/snoooz-problem-preview.html", standalone("Snoooz — Problem / Category preview", prob_css, prob_html, prob_js))

# --- combined homepage preview ---
combined_css = (
    hero_css
    + "\n\n/* ===== SOCIAL PROOF / LOGO WALL ===== */\n" + logo_css
    + "\n\n/* ===== PROBLEM / CATEGORY ===== */\n" + prob_css
)
combined_body = (
    strip_leading_html_comment(hero_html)
    + "\n\n" + strip_leading_html_comment(logo_html)
    + "\n\n" + strip_leading_html_comment(prob_html)
)
combined_js = hero_js + "\n\n" + prob_js
combined = standalone("Snoooz — Homepage preview", combined_css, combined_body, combined_js)
write("homepage-preview.html", combined)

print("Rebuilt: hero, logos, problem standalone previews + homepage-preview.html")
