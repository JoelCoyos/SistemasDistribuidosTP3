

async function MostrarReservas()
{
    const url = new URL("http://localhost:8080/api/reservas/")
    fetch(url,{
        method:'GET'
    })
    .then((response) => {
        console.log(response);
        /*if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        }*/
        return response.json();
    })
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
       alert(error);
    });

        /*client.open("GET", "http://localhost:8080/api/reservas/", true);
    client.responseType='text';
    client.send();
    client.onreadystatechange = () => {
        if (client.readyState === client.HEADERS_RECEIVED) {
          const contentType = client.getResponseHeader("Content-Type");
          console.log(contentType);
        }
      }*/
}

MostrarReservas();
