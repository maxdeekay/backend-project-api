<h1>REST API skapat för projektuppgiften i kursen DT207G</h1>
Detta repository innehåller ett enklare REST API för att sköta lagring och hantering av maträtter samt inloggning och auth.

APIet finns publicerat på följande länk: https://backend-project-api.onrender.com

<h2>Användning</h2>
Nedan följer hur man kan använda sig av APIet:
<br>
<br>
<table>
  <tr>
    <th>Metod</th>
    <th>Ändpunkt</th>
    <th>Beskrivning</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/consumables</td>
    <td>Hämta alla maträtter</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/login</td>
    <td>Logga in användare</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/register</td>
    <td>Lägga till en ny användare (används endast för att lägga till admin-användare)</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/admin/add</td>
    <td>Lägg till ny maträtt</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/admin/delete/:id</td>
    <td>Ta bort maträtt</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/admin/update/:id</td>
    <td>Uppdatera en existerande maträtt</td>
  </tr>
</table>

Maträtter kommer som JSON-data i följande format:
```json
{
  "title": "title",
  "ingredients": ["ingr1", "ingr2", "ingr3"],
  "price": "price"
}
```
