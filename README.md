# Projekt BD2 – SportTogether
## Modele ER i relacyjny
W celu otworzenia modelu należy uruchomić Oracle SQL Developer, a następnie otworzyć model poprzez File -> Data Modeler -> Open

## Uruchamianie
### Ustawienie danych dostępowych
#### Sposób 1 – `.env`
`backend/.env`:

```sh
DB_HOST=...
DB_PORT=...
DB_NAME=...
TEST_DB_NAME=...
DB_USER=...
DB_PASSWORD=...
MAIL_HOST=...
MAIL_PORT=...
MAIL_USER=...
MAIL_PASSWORD=...
```

#### Sposób 2 – ręczne ustawienie
```sh
export DB_HOST=… DB_PORT=… DB_NAME=… TEST_DB_NAME=… DB_USER=… DB_PASSWORD=… MAIL_HOST=… MAIL_PORT=… MAIL_USER=… MAIL_PASSWORD=…
```

### MySQL
#### Testowanie połączenia
```sh
pip install python-dotenv mysql-connector-python
```

```sh
python check_db_connection.py
```

### Spring backend
Katalog `backend/`

#### Budowanie
```sh
mvn package
```

#### Uruchomienie
```sh
java -jar target/SportTogether-0.0.1.jar
```

API jest dostępne na: <http://localhost:8080/api/>

### Next.js frontend
Katalog `frontend/`

#### Instalacja zależności
```sh
npm install
```

#### Wyłączenie telemetrii
```sh
npx next telemetry disable
```

#### Uruchomienie
```sh
npm run dev
```

Strona jest dostępna na: <http://localhost:3000/>

## Członkowie zespołu
- Dominika Boguszewska
- Piotr Lenczewski
- Michał Machnikowski
- Jakub Pęk
- Tomasz Truszkowski

