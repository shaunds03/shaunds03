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
how_css, how_html, how_js = read("how-it-works", "snoooz-how.css"), read("how-it-works", "snoooz-how.html"), read("how-it-works", "snoooz-how.js")
uc_css, uc_html, uc_js = read("use-cases", "snoooz-usecases.css"), read("use-cases", "snoooz-usecases.html"), read("use-cases", "snoooz-usecases.js")
net_css, net_html, net_js = read("providers", "snoooz-providers.css"), read("providers", "snoooz-providers.html"), read("providers", "snoooz-providers.js")
int_css, int_html, int_js = read("integrations", "snoooz-integrations.css"), read("integrations", "snoooz-integrations.html"), read("integrations", "snoooz-integrations.js")
proof_css, proof_html, proof_js = read("proof", "snoooz-proof.css"), read("proof", "snoooz-proof.html"), read("proof", "snoooz-proof.js")
cases_css, cases_html, cases_js = read("cases", "snoooz-cases.css"), read("cases", "snoooz-cases.html"), read("cases", "snoooz-cases.js")
sec_css, sec_html, sec_js = read("security", "snoooz-security.css"), read("security", "snoooz-security.html"), read("security", "snoooz-security.js")
why_css, why_html, why_js = read("why", "snoooz-why.css"), read("why", "snoooz-why.html"), read("why", "snoooz-why.js")

# --- standalone section previews ---
write("hero/snoooz-hero-preview.html", standalone("Snoooz — Hero preview", hero_css, hero_html, hero_js))
write("social-proof/snoooz-logos-preview.html", standalone("Snoooz — Logo wall preview", logo_css, logo_html))
write("problem/snoooz-problem-preview.html", standalone("Snoooz — Problem / Category preview", prob_css, prob_html, prob_js))
write("how-it-works/snoooz-how-preview.html", standalone("Snoooz — How it works preview", how_css, how_html, how_js))
write("use-cases/snoooz-usecases-preview.html", standalone("Snoooz — Use cases preview", uc_css, uc_html, uc_js))
write("providers/snoooz-providers-preview.html", standalone("Snoooz — Email providers preview", net_css, net_html, net_js))
write("integrations/snoooz-integrations-preview.html", standalone("Snoooz — Business integrations preview", int_css, int_html, int_js))
write("proof/snoooz-proof-preview.html", standalone("Snoooz — Inbox Impact Report preview", proof_css, proof_html, proof_js))
write("cases/snoooz-cases-preview.html", standalone("Snoooz — Enterprise cases preview", cases_css, cases_html, cases_js))
write("security/snoooz-security-preview.html", standalone("Snoooz — Security preview", sec_css, sec_html, sec_js))
write("why/snoooz-why-preview.html", standalone("Snoooz — Why Snoooz preview", why_css, why_html, why_js))

# --- combined homepage preview ---
combined_css = (
    hero_css
    + "\n\n/* ===== SOCIAL PROOF / LOGO WALL ===== */\n" + logo_css
    + "\n\n/* ===== PROBLEM / CATEGORY ===== */\n" + prob_css
    + "\n\n/* ===== HOW IT WORKS ===== */\n" + how_css
    + "\n\n/* ===== USE CASES ===== */\n" + uc_css
    + "\n\n/* ===== EMAIL PROVIDERS ===== */\n" + net_css
    + "\n\n/* ===== BUSINESS INTEGRATIONS ===== */\n" + int_css
    + "\n\n/* ===== PROOF / INBOX IMPACT REPORT ===== */\n" + proof_css
    + "\n\n/* ===== PROOF / ENTERPRISE CASES ===== */\n" + cases_css
    + "\n\n/* ===== SECURITY / TRUST ===== */\n" + sec_css
    + "\n\n/* ===== WHY SNOOOZ ===== */\n" + why_css
)
combined_body = (
    strip_leading_html_comment(hero_html)
    + "\n\n" + strip_leading_html_comment(logo_html)
    + "\n\n" + strip_leading_html_comment(prob_html)
    + "\n\n" + strip_leading_html_comment(how_html)
    + "\n\n" + strip_leading_html_comment(uc_html)
    + "\n\n" + strip_leading_html_comment(net_html)
    + "\n\n" + strip_leading_html_comment(int_html)
    + "\n\n" + strip_leading_html_comment(proof_html)
    + "\n\n" + strip_leading_html_comment(cases_html)
    + "\n\n" + strip_leading_html_comment(sec_html)
    + "\n\n" + strip_leading_html_comment(why_html)
)
combined_js = hero_js + "\n\n" + prob_js + "\n\n" + how_js + "\n\n" + uc_js + "\n\n" + net_js + "\n\n" + int_js + "\n\n" + proof_js + "\n\n" + cases_js + "\n\n" + sec_js + "\n\n" + why_js
combined = standalone("Snoooz — Homepage preview", combined_css, combined_body, combined_js)
write("homepage-preview.html", combined)

print("Rebuilt all section previews + homepage-preview.html")
