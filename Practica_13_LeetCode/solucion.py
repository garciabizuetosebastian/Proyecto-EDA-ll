"""Plantilla para resolver los problemas de LeetCode 16-20."""

from __future__ import annotations

from typing import Optional


class ListNode:
    def __init__(self, val: int = 0, next: Optional[ListNode] = None) -> None:
        self.val = val
        self.next = next


class Solution:
    def threeSumClosest(self, nums: list[int], target: int) -> int:
        valores = sorted(nums)
        mas_cercana = sum(valores[:3])

        for i in range(len(valores) - 2):
            izquierda, derecha = i + 1, len(valores) - 1
            while izquierda < derecha:
                suma = valores[i] + valores[izquierda] + valores[derecha]
                if abs(suma - target) < abs(mas_cercana - target):
                    mas_cercana = suma
                if suma == target:
                    return target
                if suma < target:
                    izquierda += 1
                else:
                    derecha -= 1
        return mas_cercana

    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []

        teclas = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "pqrs",
            "8": "tuv",
            "9": "wxyz",
        }
        combinaciones = [""]
        for digito in digits:
            if digito not in teclas:
                raise ValueError("digits solo puede contener caracteres del 2 al 9")
            combinaciones = [
                prefijo + letra
                for prefijo in combinaciones
                for letra in teclas[digito]
            ]
        return combinaciones

    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:
        valores = sorted(nums)
        resultado: list[list[int]] = []
        n = len(valores)

        for i in range(n - 3):
            if i > 0 and valores[i] == valores[i - 1]:
                continue
            for j in range(i + 1, n - 2):
                if j > i + 1 and valores[j] == valores[j - 1]:
                    continue
                izquierda, derecha = j + 1, n - 1
                while izquierda < derecha:
                    suma = (
                        valores[i]
                        + valores[j]
                        + valores[izquierda]
                        + valores[derecha]
                    )
                    if suma == target:
                        resultado.append(
                            [valores[i], valores[j], valores[izquierda], valores[derecha]]
                        )
                        izquierda += 1
                        derecha -= 1
                        while (
                            izquierda < derecha
                            and valores[izquierda] == valores[izquierda - 1]
                        ):
                            izquierda += 1
                        while (
                            izquierda < derecha
                            and valores[derecha] == valores[derecha + 1]
                        ):
                            derecha -= 1
                    elif suma < target:
                        izquierda += 1
                    else:
                        derecha -= 1
        return resultado

    def removeNthFromEnd(
        self, head: Optional[ListNode], n: int
    ) -> Optional[ListNode]:
        if n <= 0:
            raise ValueError("n debe ser positivo")

        centinela = ListNode(0, head)
        rapido = centinela
        for _ in range(n):
            if rapido.next is None:
                raise ValueError("n no puede ser mayor que la longitud de la lista")
            rapido = rapido.next

        lento = centinela
        while rapido.next is not None:
            rapido = rapido.next
            lento = lento.next
        lento.next = lento.next.next
        return centinela.next

    def isValid(self, s: str) -> bool:
        aperturas = {"(": ")", "[": "]", "{": "}"}
        pila: list[str] = []
        for caracter in s:
            if caracter in aperturas:
                pila.append(caracter)
            elif not pila or aperturas[pila.pop()] != caracter:
                return False
        return not pila
