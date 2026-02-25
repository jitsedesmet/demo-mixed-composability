import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import csv
import re
import time

START_URL = "https://digibanken.vlaanderen.be/digibanken/"
OUTPUT_FILE = "output.csv"

# Regex to match only specific digibanken pages
PAGE_REGEX = re.compile(r"https://digibanken.vlaanderen.be/digibanken/[^/]*$")


def get_soup(url):
    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        try:
            return BeautifulSoup(r.text, "lxml")
        except Exception:
            return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"Failed: {url} ({e})")
        return None


def collect_links(start_url, soup):
    """Collect links from the first page matching PAGE_REGEX"""
    links = set()
    for a in soup.find_all("a", href=True):
        link = urljoin(start_url, a["href"])
        if PAGE_REGEX.match(link):
            links.add(link)
    return links


def extract_contact_info(url, soup):
    data = {
        "name": "",
        "type": "",
        "address": "",
        "email": "",
        "phone": "",
        "website": "",
        "source_url": url
    }

    # ---- NAME & TYPE ----
    title = soup.select_one(".c-pagemeta__title")
    if title:
        data["name"] = title.get_text(strip=True)

    type_elem = soup.select_one(".c-pagemeta__type")
    if type_elem:
        data["type"] = type_elem.get_text(strip=True)

    # ---- CONTACT BLOCK ----
    contact_header = soup.find("h2", string=lambda x: x and "Contact" in x)

    if contact_header:
        dl = contact_header.find_next("dl")
        if dl:
            terms = dl.find_all("dt")
            for dt in terms:
                label = dt.get_text(strip=True).lower()
                dd = dt.find_next_sibling("dd")
                if not dd:
                    continue
                value = dd.get_text(strip=True)
                if label == "adres":
                    data["address"] = value
                elif "e-mail" in label or "e-mailadres" in label:
                    data["email"] = value
                elif "telefoon" in label:
                    # Remove optional spaces in phone number
                    data["phone"] = re.sub(r'\s+', '', value)
                elif "website" in label:
                    link = dd.find("a", href=True)
                    if link:
                        data["website"] = link["href"]

    if data["name"]:
        return data
    return None


def main():
    visited = set()

    # Open CSV file for immediate writing
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["name", "type", "address", "email", "phone", "website", "source_url"]
        )
        writer.writeheader()

        # Get soup of the start page
        soup = get_soup(START_URL)
        if not soup:
            print("Failed to fetch start URL")
            return

        # Collect links to visit (filtered)
        to_visit = collect_links(START_URL, soup)
        print(f"Found {len(to_visit)} links to visit.")

        # Visit each link once
        for url in to_visit:
            if url in visited:
                continue
            visited.add(url)

            print("Visiting:", url)
            page_soup = get_soup(url)
            if not page_soup:
                continue

            entry = extract_contact_info(url, page_soup)
            if entry:
                print("Found:", entry["name"])
                writer.writerow(entry)

            time.sleep(0.2)  # polite crawling


if __name__ == "__main__":
    main()
