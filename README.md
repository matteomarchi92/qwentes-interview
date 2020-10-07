# Qwentes Application

## Premessa
L'esercizio consiste nello sviluppare un portale che ha le seguenti pagine:
- [login](#login)
- una [lista utenti](#lista-utenti)
- un [dettaglio utente](#dettaglio-utente)
- una [lista posts](#lista-posts)
- un [dettaglio post](#dettaglio-post)

Nella repo si possono vedere tutte le immagini dell'applicativo che si andrà a sviluppare ed i testi contenuti tra `[]` devono essere sostituiti con i dati presi dalle chiamate http.

## Login
> Immagini: [login](https://github.com/qwentes-team/application-interview/blob/main/01%20-%20Login.jpg) / [login invalid](https://github.com/qwentes-team/application-interview/blob/main/02%20-%20Login%20invalid.jpg)

Il portale prevede una login finta, i campi required dell'autenticazione sono:
- email - con controllo che sia una email valida
- password - minimo 4 caratteri

Se i campi non sono validi il bottone non si deve abilitare e l'input in errore deve avere un bordo rosso.
Se i campi sono validi settare nel localStorage una chiave `token` con un valore a piacere e fare il redirect verso la pagina [lista utenti](#lista-utenti).

## Lista utenti
> Immagini: [lista utenti](https://github.com/qwentes-team/application-interview/blob/main/03%20-%20Contact%20list.jpg)

Gli utenti devono essere presi tramite una chiamata http in GET: `https://jsonplaceholder.typicode.com/users`.
Ogni utente deve mostrare:
- Nome completo
- Via
- Città
- Iniziali del nome e del cognome *(Es: se il nome è Mario Rossi, le iniziali saranno MR)*

Al click su un utente si deve andare sul [dettaglio utente](#dettaglio-utente)

## Dettaglio utente
> Immagini: [dettaglio utente](https://github.com/qwentes-team/application-interview/blob/main/04%20-%20Contact%20detail.jpg)

Il dettaglio utente si ricava tramite una chiamata http in GET: `https://jsonplaceholder.typicode.com/users/{userId}`.
La pagina deve mostrare un form che consente la modifica di alcune informazioni dell'utente:
- Nome - minimo 6 caratteri
- email - con controllo che sia una email valida
- Company Name

I campi required devono essere validati e si devono comportare come la login in caso di errore. Lo stesso vale per il bottone del form.
Una volta che il form è valido, il bottone si abilita ed al click deve partire una chiamata in POST: `https://jsonplaceholder.typicode.com/users/{userId}` passando come payload.
```js
{
	name: "<valore del form>",
	email: "<valore del form>",
	company: {
		name: "<valore del form>"
	}
}
```
Ovviamente la chiamata in POST non andrà a modificare realmente il dato visto che le API sono solo dei placeholder, la cosa importante è inviare il payload ed avere un 200 come risposta.
Al di sotto del form si devono vedere i post creati dall'utente che stiamo visualizzando, si possono ottenere facendo una chiamata http in GET: `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
Ogni post deve mostrare:
- Post title
- Post body
Al click del post si deve andare sul [dettaglio post](#dettaglio-post)

## Lista posts
> Immagini: [lista posts](https://github.com/qwentes-team/application-interview/blob/main/05%20-%20Post%20list.jpg)

Si tratta di una semplice lista di post, i dati da visualizzare si ottengono facendo una chiamata http in GET: `https://jsonplaceholder.typicode.com/posts`.
Ogni post deve mostrare:
- Post title
- Post body

Al click del post si deve andare sul [dettaglio post](#dettaglio-post)

## Dettaglio post
> Immagini: [dettaglio post](https://github.com/qwentes-team/application-interview/blob/main/06%20-%20Post%20detail.jpg)

Le informazioni da mostrare nel dettaglio sono:
- Post title
- Post body

Reperibili tramite chiamata http in GET: `https://jsonplaceholder.typicode.com/posts/{postId}`

L'autore del post con le informazioni mostrate nella [lista utenti](#lista-utenti), reperibili tramite chiamata http in GET: `https://jsonplaceholder.typicode.com/users/{userId}`

Una lista di commenti, dove ogni commento deve mostrare 
- Comment name
- Comment body

Reperibili tramite chiamata http in GET: `https://jsonplaceholder.typicode.com/comments?postId={postId}`
