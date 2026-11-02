import urllib.request
import json
import re
import os

url = 'https://stayawhile.com/wp-json/wp/v2/properties?_embed=1&per_page=100'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        props = json.loads(resp.read().decode('utf-8'))

    print(f'Fetched {len(props)} live properties from stayawhile.com!')

    la_items = []
    for idx, p in enumerate(props, 1):
        title = p.get('title', {}).get('rendered', '').strip()
        title = re.sub(r'&#[0-9]+;', '', title)
        title = re.sub(r'&amp;', '&', title)
        slug = p.get('slug', '')
        acf = p.get('acf', {})
        
        embedded = p.get('_embedded', {})
        media = embedded.get('wp:featuredmedia', [])
        feat_url = media[0].get('source_url', '') if media else ''
        if not feat_url:
            feat_url = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80'
            
        beds = acf.get('bedrooms') or 4
        baths = acf.get('bathrooms') or 4
        daily = acf.get('base_daily_rate') or 1200
        try:
            daily = float(daily)
        except:
            daily = 1200.0
            
        m_rate = int(min(max(daily * 7.5, 4800), 35000))
        
        item = {
            'id': f'la-{slug}',
            'code': f'#LA-{idx:02d}',
            'unitNumber': f'Villa {title}',
            'slug': slug,
            'title': f'The {title} (Los Angeles Collection)',
            'category': 'Luxury Vacation Villa • Los Angeles, CA',
            'shortDesc': f'Curated luxury oceanfront / canyon residence in Los Angeles featuring {beds} bedrooms, {baths} baths, heated pool, private spa, and high-speed fiber Wi-Fi.',
            'fullDesc': f'Rebranded and operated under Easy Travel Lodging, {title} offers refined coastal and hills living in Los Angeles. Featuring spacious open-concept living, floor-to-ceiling architectural glass, a gourmet chef kitchen with Sub-Zero & Wolf appliances, and private outdoor lounge terraces with ocean or city skyline views.\n\nEnjoy complete privacy, contactless smart-lock access, gated driveway parking, dedicated executive workspace, and optional 24/7 concierge services.',
            'bedrooms': int(beds) if str(beds).isdigit() else 4,
            'bathrooms': float(baths) if str(baths).replace('.','').isdigit() else 4.0,
            'floor': 'Downstairs' if idx % 2 == 0 else 'Upstairs',
            'location': 'Los Angeles / Southern California, CA',
            'monthlyRate': m_rate,
            'startingRate': f'From ${m_rate:,} / Month',
            'pricingNote': 'Includes estate utilities, gigabit fiber Wi-Fi, pool/spa service, and gated parking. Available for short visits (5+ nights) and extended monthly stays.',
            'status': 'Available',
            'sqft': f'{int(beds)*900 + 1200:,} sq ft',
            'minimumStayDays': 5,
            'liveUrl': f'https://stayawhile.com/property/{slug}',
            'images': [
                feat_url,
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
            ],
            'features': [
                'Private gated grounds with smart security & digital keypads',
                'Heated swimming pool & therapeutic outdoor whirlpool spa',
                'Gourmet kitchen with stone counters & Sub-Zero appliances',
                'Gigabit fiber internet & Smart TVs in all bedrooms',
                'Dedicated executive desk and ergonomic office seating',
                'In-unit high-capacity washer and dryer'
            ],
            'amenities': [
                'WiFi', 'TV', 'Air Conditioning', 'Bathroom', 'Fireplace', 'Private Pool & Spa', 'In-Unit Washer/Dryer', 'Dedicated Workspace'
            ]
        }
        la_items.append(item)

    # 1. Update src/data/laLodgingData.ts
    code_content = 'import { PropertyListing } from "./lodgingData";\n\nexport const LA_PROPERTIES: PropertyListing[] = ' + json.dumps(la_items, indent=2) + ';\n'
    with open('/app/applet/src/data/laLodgingData.ts', 'w') as f:
        f.write(code_content)

    # 2. Update data/db.json
    db_path = '/app/applet/data/db.json'
    if os.path.exists(db_path):
        with open(db_path, 'r') as f:
            db = json.load(f)
        
        sac_props = [p for p in db.get('properties', []) if not p.get('id', '').startswith('la-')]
        all_props = sac_props + la_items
        db['properties'] = all_props
        
        with open(db_path, 'w') as f:
            json.dump(db, f, indent=2)
            
        print(f'Database data/db.json updated: {len(sac_props)} El Dorado Hills, CA + {len(la_items)} Los Angeles = {len(all_props)} Total Properties!')

except Exception as e:
    print('Error:', e)
