"""Pruebas de los problemas LeetCode 16-20.

Ejecuta este archivo con `python analisis.py` cuando termines las soluciones.
"""

import unittest

from solucion import ListNode, Solution


def crear_lista(valores):
    cabeza = cola = ListNode()
    for valor in valores:
        cola.next = ListNode(valor)
        cola = cola.next
    return cabeza.next


def valores_lista(cabeza):
    valores = []
    while cabeza is not None:
        valores.append(cabeza.val)
        cabeza = cabeza.next
    return valores


class PruebasLeetCode(unittest.TestCase):
    def setUp(self):
        self.solucion = Solution()

    def test_16_tres_suma_mas_cercana(self):
        self.assertEqual(self.solucion.threeSumClosest([-1, 2, 1, -4], 1), 2)
        self.assertEqual(self.solucion.threeSumClosest([1, 2, 4, 8], 6), 7)
        self.assertEqual(self.solucion.threeSumClosest([0, 0, 0], 1), 0)

    def test_17_combinaciones_de_teclado(self):
        resultado = self.solucion.letterCombinations("23")
        esperado = {
            "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"
        }
        self.assertEqual(set(resultado), esperado)
        self.assertEqual(self.solucion.letterCombinations(""), [])

    def test_18_cuatro_suma(self):
        resultado = self.solucion.fourSum([1, 0, -1, 0, -2, 2], 0)
        esperado = {
            (-2, -1, 1, 2),
            (-2, 0, 0, 2),
            (-1, 0, 0, 1),
        }
        self.assertEqual({tuple(grupo) for grupo in resultado}, esperado)
        self.assertEqual(self.solucion.fourSum([2, 2, 2, 2, 2], 8), [[2, 2, 2, 2]])

    def test_19_eliminar_n_esimo_desde_el_final(self):
        cabeza = crear_lista([1, 2, 3, 4, 5])
        resultado = self.solucion.removeNthFromEnd(cabeza, 2)
        self.assertEqual(valores_lista(resultado), [1, 2, 3, 5])

        cabeza = crear_lista([1])
        resultado = self.solucion.removeNthFromEnd(cabeza, 1)
        self.assertEqual(valores_lista(resultado), [])

    def test_20_parentesis_validos(self):
        self.assertTrue(self.solucion.isValid("()[]{}"))
        self.assertTrue(self.solucion.isValid("[{()}]"))
        self.assertFalse(self.solucion.isValid("(]"))
        self.assertFalse(self.solucion.isValid("[(])"))
        self.assertFalse(self.solucion.isValid("("))


if __name__ == "__main__":
    unittest.main(verbosity=2)
