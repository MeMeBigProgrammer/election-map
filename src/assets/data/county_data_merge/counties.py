import csv
import json

csv_data = []

final = None

with open('./MIT_Election_Data_2000_2016.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for index, value in enumerate(csv_reader):
        csv_data.append(value)

with open('../shapefiles/output.json') as f:
    data = json.load(f)
    for i, county in enumerate(data['features']):
        shape_FIPS = county['properties']['GEOID']
        county['properties']['2000'] = {'totalVotes': 0, 'candidates': []}
        county['properties']['2004'] = {'totalVotes': 0, 'candidates': []}
        county['properties']['2008'] = {'totalVotes': 0, 'candidates': []}
        county['properties']['2012'] = {'totalVotes': 0, 'candidates': []}
        county['properties']['2016'] = {'totalVotes': 0, 'candidates': []}

        del county['properties']['ALAND']
        del county['properties']['AWATER']

        for index, value in enumerate(csv_data):
            if len(value[4]) == 4:
                value[4] = "0" + value[4]
            if index != 0 and value[4] == shape_FIPS:
                new_val = county['properties'][value[0]]
                new_val['totalVotes'] = value[9]
                new_val['candidates'].append(
                    {'name': value[6], 'party': value[7], 'votes': value[8]})

                county['properties'][value[0]] = new_val

        data['features'][i] = county
        print(i)

    final = data

with open("./final.json", "w") as outfile:
    json.dump(final, outfile)
