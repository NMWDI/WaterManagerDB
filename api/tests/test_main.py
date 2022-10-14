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
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_read_meters():
    response = client.get('/meters')
    assert response.status_code == 200
    data = response.json()
    assert data[0]['serial_number'] == '1992-4-1234'
    assert data[0]['name'] == 'moo'
    assert data[1]['name'] == 'tor'
    assert data[2]['name'] == 'hag'


def test_read_alerts():
    response = client.get('/alerts')
    assert response.status_code == 200
    assert response.json()[0]['alert'] == 'foo bar alert'
    assert response.json()[0]['meter_serial_number'] == '1992-4-1234'
    assert 'open_timestamp' in response.json()[0].keys()
    assert response.json()[0]['closed_timestamp'] is None
    assert response.json()[0]['active']


def test_read_wells():
    response = client.get('/wells')
    assert response.status_code == 200
    assert sorted(response.json()[0].keys()) == ['id', 'latitude', 'location',
                                                 'longitude', 'name', 'osepod', 'owner_id']


def test_post_alert():
    response = client.post('/alerts', json={'meter_id': 1, 'alert': 'this is an alert'})
    assert response.status_code == 200


def test_api_status():
    response = client.get('/api_status')
    assert response.status_code == 200
    assert response.json() == {'ok': True}

# ============= EOF =============================================
