INSERT INTO public."Units" (id, name, name_short, description) VALUES
    ('1', 'Acre-feet', 'acre-ft', 'Volume of water in acre-feet'),
    ('2', 'Gallons', 'gal', 'Volume of water in gallons'),
    ('3', 'Kilowatt hours', 'kWh', 'Total electricity'),
    ('4', 'Gas BTU', 'btu', 'Total gas'),
    ('5', 'Percent', '%', 'Percentage'),
    ('6', 'feet', 'ft', 'feet'),
    ('7', 'meters', 'm', 'meters'),
    ('8', 'Micrograms per Liter', 'ug/L', 'Concentration of substance in a water sample.'),
    ('10', 'Barrels', 'barrels', 'Volume of water in barrels'),
    ('11', 'Inches', 'in', 'Inches'),
    ('12', 'Gallons per minute', 'gal/min', 'Flow rate in gallons/min'),
    ('13', 'Barrels per minute', 'barrels/min', 'Flow rate in barrels/min')
    ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."Units_id_seq"', 13, true);
