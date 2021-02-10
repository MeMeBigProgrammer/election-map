import csv
import json

csv_data = []

final = None

with open('./MIT_Election_Data_2000_2016.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for index, value in enumerate(csv_reader):
        csv_data.append(value)

with open('../2019_county_election_map.json') as f:
    data = json.load(f)
    for i, county in enumerate(data['features']):
        shape_FIPS = county['properties']['GEOID']
        county['properties']['2000'] = {'totalvotes': 0, 'candidates': []}
        county['properties']['2004'] = {'totalvotes': 0, 'candidates': []}
        county['properties']['2008'] = {'totalvotes': 0, 'candidates': []}
        county['properties']['2012'] = {'totalvotes': 0, 'candidates': []}
        county['properties']['2016'] = {'totalvotes': 0, 'candidates': []}

        for index, value in enumerate(csv_data):
            if index != 0 and value[4] == shape_FIPS:
                new_val = county['properties'][value[0]]
                new_val['totalvotes'] = value[9]
                new_val['candidates'].append(
                    {'name': value[6], 'party': value[7], 'votes': value[8]})

                county['properties'][value[0]] = new_val

        data['features'][i] = county
        print(i)

    final = data

with open("./final.json", "w") as outfile:
    print(type(final))
    json.dump(final, outfile)
