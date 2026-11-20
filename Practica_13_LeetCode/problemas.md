# LeetCode 16–20

Estos son resúmenes redactados para la práctica. Consulta cada enlace para ver el
enunciado oficial completo y sus restricciones.

## 16. 3Sum Closest

**Enunciado resumido:** Dado un arreglo de enteros con al menos tres elementos y
un valor `target`, elige tres posiciones distintas. Devuelve la suma de esos
tres valores que tenga la menor diferencia con `target`.

**Ejemplo propio:** `nums = [1, 2, 4, 8]`, `target = 6` → `7`.

**Método:** `threeSumClosest(nums, target) -> int`  
**Enunciado oficial:** [leetcode.com/problems/3sum-closest](https://leetcode.com/problems/3sum-closest/)

## 17. Letter Combinations of a Phone Number

**Enunciado resumido:** Cada dígito del 2 al 9 representa varias letras, como
en el teclado de un teléfono. Para una cadena de dígitos, devuelve todas las
cadenas que se forman escogiendo una letra para cada dígito. Si la entrada está
vacía, devuelve una lista vacía.

**Ejemplo propio:** `digits = "2"` → `["a", "b", "c"]`.

**Método:** `letterCombinations(digits) -> list[str]`  
**Enunciado oficial:** [leetcode.com/problems/letter-combinations-of-a-phone-number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

## 18. 4Sum

**Enunciado resumido:** Dado un arreglo de enteros y un valor `target`, busca
grupos de cuatro elementos tomados de posiciones distintas cuya suma sea
`target`. Devuelve cada grupo de valores una sola vez.

**Ejemplo propio:** `nums = [-2, 0, 0, 2]`, `target = 0` →
`[[-2, 0, 0, 2]]`.

**Método:** `fourSum(nums, target) -> list[list[int]]`  
**Enunciado oficial:** [leetcode.com/problems/4sum](https://leetcode.com/problems/4sum/)

## 19. Remove Nth Node From End of List

**Enunciado resumido:** Dada la cabeza de una lista enlazada y un entero `n`,
elimina el elemento que ocupa la posición `n` contando desde el final. Devuelve
la cabeza de la lista resultante.

**Ejemplo propio:** `5 → 8 → 3 → 1`, `n = 2` → `5 → 8 → 1`.

**Método:** `removeNthFromEnd(head, n) -> ListNode`  
**Enunciado oficial:** [leetcode.com/problems/remove-nth-node-from-end-of-list](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

## 20. Valid Parentheses

**Enunciado resumido:** Dada una cadena formada por paréntesis, corchetes y
llaves, determina si cada símbolo de apertura tiene un cierre del mismo tipo y
si todos están correctamente anidados.

**Ejemplos propios:** `"[{()}]"` → `true`; `"[(])"` → `false`.

**Método:** `isValid(s) -> bool`  
**Enunciado oficial:** [leetcode.com/problems/valid-parentheses](https://leetcode.com/problems/valid-parentheses/)
