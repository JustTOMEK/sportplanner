# Projekt BD2 – SportTogether
## Modele ER i relacyjny
W celu otworzenia modelu należy uruchomić Oracle SQL Developer, a następnie otworzyć model poprzez File -> Data Modeler -> Open

## Uruchamianie
### Zmienne środowiskowe – dane dostępowe
```sh
export DB_HOST=… DB_PORT=… DB_NAME=… DB_USER=… DB_PASSWORD=…
```

### MySQL
#### Testowanie połączenia
```sh
pip install mysql-connector-python
```

```sh
python check_db_connection.py
```

### Spring backend
#### Budowanie
```sh
mvn package
```

#### Uruchomienie
```sh
java -jar target/SportTogether-0.0.1.jar
```

API jest dostępne na: <http://localhost:8080/api/>

## Członkowie zespołu
- Dominika Boguszewska
- Piotr Lenczewski
- Michał Machnikowski
- Jakub Pęk
- Tomasz Truszkowski

