WITH
    inserted_rows AS (
        INSERT INTO public."MeterTypeLU"
            (id, brand, series, model, size, description, in_use)
        VALUES
            (
                '14',
                'MCCROMETER',
                NULL,
                'Unknown',
                NULL,
                'Unknown model number',
                't'
            ),
            (
                '24',
                'BADGER',
                NULL,
                'Unknown',
                NULL,
                'Unknown model number',
                't'
            ),
            (
                '41',
                'MCCROMETER',
                NULL,
                'Proline ProMag W 400',
                '6',
                'Flanged tube type meter',
                't'
            ),
            (
                '42',
                'MCCROMETER',
                NULL,
                'Proline ProMag W 400',
                '6',
                'Flanged tube type meter',
                't'
            ),
            ('36', 'TESTING', NULL, '999-999', '6', 'Testing....', 'f'),
            (
                '28',
                'ROCKWELL',
                NULL,
                'Unknown',
                '0',
                'Unknown model number',
                'f'
            ),
            ('29', 'SENSUS', NULL, 'Unknown', '0', 'Unknown model number', 'f'),
            (
                '30',
                'SPARLIN',
                NULL,
                'Unknown',
                '0',
                'Unknown model number',
                'f'
            ),
            (
                '31',
                'MASTER METER',
                NULL,
                'Unknown',
                '0',
                'Unknown model number',
                'f'
            ),
            (
                '32',
                'COGNITIS FLUID DATA',
                NULL,
                'Unknown',
                '0',
                'Unknown model number',
                'f'
            ),
            (
                '33',
                'FLOW CONTROL',
                NULL,
                'Unknown',
                '0',
                'Unknown model number',
                'f'
            ),
            (
                '34',
                'Unknown',
                NULL,
                'Unknown',
                '0',
                'Old, out of service meter of unknown type',
                'f'
            ),
            (
                '43',
                'MCCROMETER',
                NULL,
                'Proline ProMag W 400',
                '4',
                'Flanged tube type meter',
                't'
            ),
            ('17', 'BADGER', NULL, '2"', '2', '2" CHAMBER', 'f'),
            ('18', 'BADGER', NULL, '3"', '3', '3" CHAMBER', 'f'),
            (
                '38',
                'BADGER',
                NULL,
                'NS-WMES015-05',
                '1.5',
                'NS E-SERIES ELECTRONIC 1.5 METER',
                't'
            ),
            (
                '16',
                'BADGER',
                NULL,
                'WMM070-D01LL',
                '1',
                '$ 276.40-BADGER W / CLPGS',
                't'
            ),
            (
                '25',
                'BADGER',
                NULL,
                'CF31-150BI-NL',
                '1.5',
                '$38.05-1.5'''' FLGS & BOLT KITS (EACH)',
                't'
            ),
            (
                '21',
                'BADGER',
                NULL,
                'WMT0160-D01LL',
                '1.5',
                '$1264.00-1.5 TURBO',
                't'
            ),
            (
                '26',
                'BADGER',
                NULL,
                'CF31-200BI-NL',
                '2',
                '$39.35- 2'''' FLGS & BOLT KITS (EACH)',
                't'
            ),
            (
                '27',
                'BADGER',
                NULL,
                'FFCF-0303D',
                '3',
                '$77.55-3"FLANGES (EACH)',
                't'
            ),
            (
                '19',
                'BADGER',
                NULL,
                '3/4"',
                '0.75',
                '$155.19-BADGER W / CLPGS',
                't'
            ),
            (
                '20',
                'BADGER',
                NULL,
                '5/8"',
                '0.625',
                '$64.75-BADGER W / CLPGS',
                't'
            ),
            (
                '15',
                'MCCROMETER',
                NULL,
                'MW502',
                '2',
                '$1198.59-2" FLANGED TUBE ',
                't'
            ),
            (
                '22',
                'BADGER',
                NULL,
                'WMT-0450',
                '3',
                '$1035.00-3" TURBO W/BOLT KITS & FLGS',
                't'
            ),
            (
                '37',
                'BADGER 1.5''''',
                NULL,
                'NS-WMES015-05',
                '1.5',
                '$737.00-E-SERIES ( ELECTRONIC METER ) 00000000.0',
                't'
            ),
            (
                '1',
                'MCCROMETER',
                NULL,
                'MO304',
                '4',
                '$1242.45-4" SADDLE METER',
                't'
            ),
            (
                '2',
                'MCCROMETER',
                NULL,
                'MO306',
                '6',
                '$1297.95-6" SADDLE METER',
                't'
            ),
            (
                '3',
                'MCCROMETER',
                NULL,
                'MO308',
                '8',
                '$1433.05-8" SADDLE METER',
                't'
            ),
            (
                '5',
                'MCCROMETER',
                NULL,
                'MO312',
                '12',
                '$1783.00-12" SADDLE METER',
                't'
            ),
            (
                '6',
                'MCCROMETER',
                NULL,
                'MO314',
                '14',
                '$1963.00-14" SADDLE METER',
                't'
            ),
            (
                '7',
                'MCCROMETER',
                NULL,
                'MO316',
                '16',
                '$2160.00-16" SADDLE METER',
                't'
            ),
            (
                '8',
                'MCCROMETER',
                NULL,
                'MW503',
                '3',
                '$1871.45-3" FLANGED TUBE',
                't'
            ),
            (
                '10',
                'MCCROMETER',
                NULL,
                'MW506',
                '6',
                '42314.55-6" FLANGED TUBE',
                't'
            ),
            (
                '11',
                'MCCROMETER',
                NULL,
                'MW508',
                '8',
                '$2498.15-8'''' FLANGED TUBE',
                't'
            ),
            (
                '12',
                'MCCROMETER',
                NULL,
                'MW510',
                '10',
                '$3376.20-10'''' FLANGED TUBE',
                't'
            ),
            (
                '13',
                'MCCROMETER',
                NULL,
                'MW512',
                '12',
                '$3594.65-12'''' FLANGED TUBE',
                't'
            ),
            (
                '23',
                'BADGER',
                NULL,
                'WMT0200-F01LL',
                '2',
                '$1175.00-2" TURBO',
                't'
            ),
            (
                '39',
                'MCCROMETER',
                NULL,
                'MD309F',
                '9',
                '9'''' Special Order for Berrendo Water- 6 mile hill tank',
                't'
            ),
            (
                '40',
                'BADGER',
                NULL,
                'NR-WMESG2-01-TH',
                '1',
                'Electronic G2, 1 inch brass meter, $310.00',
                't'
            ),
            (
                '9',
                'MCCROMETER',
                NULL,
                'MW504',
                '4',
                '$2011.11-4" FLANGED TUBE',
                't'
            ),
            (
                '4',
                'MCCROMETER',
                NULL,
                'MO310',
                '10',
                '$1517.25 - 10" SADDLE METER',
                't'
            )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."MeterTypeLU_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
