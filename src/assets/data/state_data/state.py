import pandas as pd

# process data
df = pd.DataFrame(pd.read_csv("MIT_STATE_Election_Data_2076_2016.csv"))

# delete unnecessary columsn
del df['state_cen']
del df['state_ic']
del df['office']
del df['version']
del df['notes']

df = df.loc[df['party_simplified'] == 'OTHER'].groupby(
    ['year', 'state', 'party_simplified']).apply(lambda x: x)

print(df.head())
print(df.info())

#append = pd.DataFrame(columns=df.columns)
