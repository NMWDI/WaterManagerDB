# ===============================================================================
# Copyright 2022 ross
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ===============================================================================
import xlsxwriter
from geoalchemy2.elements import WKBElement


def populate_sheet(sh, records, columns):

    for col, attr in enumerate(columns):
        sh.write(0, col, attr.name)
    #
    for row, record in enumerate(records):
        for col, attr in enumerate(columns):
            try:
                value = getattr(record, attr.name)
                sh.write(row+1, col, value)
            except BaseException:
                sh.write(row+1, col, '')


def make_xls_backup(db, tables):
    path = 'backup.xlsx'
    wb = xlsxwriter.Workbook(path)

    for table in tables:
        records = db.query(table).all()
        sh = wb.add_worksheet(table.__tablename__)
        populate_sheet(sh, records, table.__table__.columns)

    wb.close()

    return path
# ============= EOF =============================================
