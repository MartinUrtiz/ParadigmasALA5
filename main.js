import { lvar, eq, and, or, run, run1, runMany, value } from "./logic-mini.js";


// Variables Lógicas
const heroes = lvar("heroes");
const aliados = lvar("aliados");
const enemigos = lvar("enemigos");


// Relaciones lógicas

// Aliados
function esAliado(x, y) {
  return or(
    and(eq(x, "Batman"), eq(y, "Robin")),
    and(eq(x, "Iron Man"), eq(y, "Spider-Man")),
    and(eq(x, "Wonder Woman"), eq(y, "Superman"))
  );
}

// Enemigos
function esEnemigo(x, y) {
  return or(
    and(eq(x, "Batman"), eq(y, "Joker")),
    and(eq(x, "Spider-Man"), eq(y, "Green Goblin")),
    and(eq(x, "Superman"), eq(y, "Lex Luthor"))
  );
}

// Mentores
function esMentor(x, y) {
  return or(
    and(eq(x, "Batman"), eq(y, "Robin")),
    and(eq(x, "Iron Man"), eq(y, "Spider-Man"))
  );
}


// CONSULTAS

//  Encontrar todos los aliados de Batman.
const x = lvar();
console.log("Aliados de Batman:", run1(esAliado("Batman", x), x));

// Encontrar todos los enemigos de Superman.
const y = lvar();
console.log("Enemigos de Superman:", run1(esEnemigo("Superman", y), y));


// ¿Quién es mentor de Spider-Man?
const z = lvar();
console.log("Mentor de Spider-Man:", run1(esMentor(z, "Spider-Man"), z));


// Mostrar todos los pares héroe-aliado que existen en la base de conocimiento.
const h = lvar();
const a = lvar();
console.log("Todos los pares héroe–aliado:", runMany(esAliado(h, a), [h, a]));

