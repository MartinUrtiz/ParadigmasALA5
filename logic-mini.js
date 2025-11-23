// ======== Mini-Lógica estilo logicjs ========

// Crea una variable lógica
export function lvar(name = undefined) {
  return { type: "lvar", name: name ?? Math.random().toString(36).slice(2) };
}

// Comparación
export function eq(a, b) {
  return { type: "eq", a, b };
}

// Conjunción
export function and(...conds) {
  return { type: "and", conds };
}

// Disyunción
export function or(...conds) {
  return { type: "or", conds };
}

// ------ Motor de unificación ------

function isVar(x) {
  return x && typeof x === "object" && x.type === "lvar";
}

function unify(a, b, env) {
  if (isVar(a)) return unifyVar(a, b, env);
  if (isVar(b)) return unifyVar(b, a, env);
  return a === b ? env : null;
}

function unifyVar(v, x, env) {
  const name = v.name;

  if (env[name] !== undefined) return unify(env[name], x, env);
  if (isVar(x) && env[x.name] !== undefined) return unify(v, env[x.name], env);
  if (isVar(x) && x.name === name) return env;

  const newEnv = { ...env };
  newEnv[name] = x;
  return newEnv;
}

// Evaluación de condiciones
function evalCond(cond, env) {
  if (cond.type === "eq") return unify(cond.a, cond.b, env);

  if (cond.type === "and") {
    let e = env;
    for (const c of cond.conds) {
      e = evalCond(c, e);
      if (!e) return null;
    }
    return e;
  }

  if (cond.type === "or") {
    const results = [];
    for (const c of cond.conds) {
      const r = evalCond(c, env);
      if (r) Array.isArray(r) ? results.push(...r) : results.push(r);
    }
    return results.length ? results : null;
  }

  return null;
}

// Ejecutar consulta
export function run(vars, metas) {
  let envs = [{}];

  for (const goal of metas) {
    const nuevos = [];

    for (const env of envs) {
      const r = evalCond(goal, env);
      if (!r) continue;
      Array.isArray(r) ? nuevos.push(...r) : nuevos.push(r);
    }

    envs = nuevos;
  }

  return envs;
}

// Obtener valor de variable lógica
export function value(env, variable) {
  return env[variable.name];
}

// ======== Capa de compatibilidad estilo logicjs ========

// Permite run(meta, variable)
export function run1(meta, variable) {
  return run([variable], [meta]).map(s => value(s, variable));
}

// Permite run(meta, [vars])
export function runMany(meta, vars) {
  const sols = run(vars, [meta]);
  return sols.map(env => vars.map(v => value(env, v)));
}
