import collections
import heapq
from typing import List, Optional

"""En este documento se incluirán todas las soluciones de los leetcode vistos durante el proyecto"""


# LeetCode define estas clases automáticamente; se incluyen para poder ejecutar el archivo localmente
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


#LC 148
""""Ordenar una cola ligada de elementos en tiempo nlog(n)"""
def lc148(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next:
        return head

    #Dividir cola
    izq = head
    der = getMid(head)
    temp = der.next
    der.next = None
    der = temp

    izq = lc148(izq)
    der = lc148(der)

    return merge(izq, der)

def getMid(head: ListNode) -> ListNode:
    slow, fast = head, head.next

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    return slow

def merge(lista_1: Optional[ListNode], lista_2: Optional[ListNode]) -> Optional[ListNode]:
    cola = dummy = ListNode()

    while lista_1 and lista_2:
        if lista_1.val < lista_2.val:
            cola.next = lista_1
            lista_1 = lista_1.next
        else:
            cola.next = lista_2
            lista_2 = lista_2.next

        cola = cola.next
    #Agregar sobrante de ambas listas
    if lista_1:
        cola.next = lista_1
    if lista_2:
        cola.next = lista_2

    return dummy.next

#LC 33
"""Búsqueda en una matriz ordenada y rotada"""
def lc33(nums: List[int], objetivo: int) -> int:
    izq = 0
    der = len(nums) - 1

    while izq <= der:
        centro = (izq + der) // 2
        if objetivo == nums[centro]:
            return centro

        if nums[izq] <= nums[centro]:
            if objetivo > nums[centro] or objetivo < nums[izq]:
                izq = centro + 1
            else:
                der = centro - 1

        else:
            if objetivo < nums[centro] or objetivo > nums[der]:
                der = centro - 1
            else:
                izq = centro + 1

    return -1

#LC 175
# (Este problema es de SQL, no tiene solución en Python)

#LC 1011
"""Capacidad de entregar paquetes en D dias"""
def lc1011(paquetes: List[int], dias: int) -> int:
    def calcular_dias(capacidad: int) -> int:
        days = 1
        capacidad_actual = capacidad

        for paquete in paquetes:
            if capacidad_actual - paquete < 0:
                days += 1
                capacidad_actual = capacidad

            capacidad_actual -= paquete

        return days

    cap_min = max(paquetes)
    cap_max = sum(paquetes)
    cap_final = cap_max

    while cap_min <= cap_max:
        cap_med = (cap_min + cap_max) // 2

        if calcular_dias(cap_med) <= dias:
            cap_final = cap_med
            cap_max = cap_med - 1
        else:
            cap_min = cap_med + 1

    return cap_final

#LC 98
"""Determinar si un arbol es un árbol binario de búsqueda (BST) válido"""
def lc98(raiz: Optional[TreeNode]) -> bool:
    def valid(nodo, izq, der):
        if not nodo:
            return True

        if not (izq < nodo.val < der):
            return False

        return valid(nodo.left, izq, nodo.val) and valid(nodo.right, nodo.val, der)

    return valid(raiz, float("-inf"), float("inf"))

#LC 322
"""Calcular el número mínimo de monedas necesarias para alcanzar cierta cantidad, si la cantidad no es obtenible con las monedas dadas devolver -1"""
def lc322(monedas: List[int], cantidad: int) -> int:
    dp = [cantidad + 1] * (cantidad + 1)
    dp[0] = 0

    for a in range(1, cantidad + 1):
        for c in monedas:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])

    if dp[cantidad] != (cantidad + 1):
        return dp[cantidad]
    else:
        return -1

#LC 70
"""Se está subiendo una escalera de n escalones. Se pueden subir 1 o 2 escalones, determinar cuantas maneras hay de subir las escaleras"""
def lc70(n: int) -> int:
    uno = 1
    dos = 1

    for i in range(n - 1):
        temp = uno
        uno = uno + dos
        dos = temp

    return uno

#LC 1396
"""Diseñar un sistema de metro"""
class UndergroundSystem:
    def __init__(self):
        self.checkInMap = {} # id -> (startStation, time)
        self.totalMap = {} # (start, end) -> [totalTime, count]

    def checkIn(self, id: int, startStation: str, t: int) -> None:
        self.checkInMap[id] = (startStation, t)

    def checkOut(self, id: int, endStation: str, t: int) -> None:
        start, time = self.checkInMap[id]

        route = (start, endStation)

        if route not in self.totalMap:
            self.totalMap[route] = [0, 0]

        self.totalMap[route][0] += t - time
        self.totalMap[route][1] += 1

    def getAverageTime(self, startStation: str, endStation: str) -> float:
        total, count = self.totalMap[(startStation, endStation)]
        return total / count

#LC 743
"""Calcular el tiempo que le toma a una señal llegar a todos los "n" nodos en un grafo ponderado"""
def lc743(times: List[List[int]], n: int, k: int) -> int:
    edges = collections.defaultdict(list)

    for u, v, w in times:
        edges[u].append((v, w))

    minHeap = [(0, k)]
    visited = set()
    t = 0

    while minHeap:
        w1, n1 = heapq.heappop(minHeap)
        if n1 in visited:
            continue

        visited.add(n1)
        t = max(t, w1)

        for n2, w2 in edges[n1]:
            if n2 not in visited:
                heapq.heappush(minHeap, (w1 + w2, n2))

    return t if len(visited) == n else -1

#LC 210
"""Dada una lista de n cursos, donde algunos se deben haber cursado para poder cursar otros, retornar el órden en que se deberían tomar para poder tomar todos.
    en caso de que esto no se pueda retornar un arrreglo vacío"""
def lc210(N_cursos: int, prerequisitos: List[List[int]]) -> List[int]:
    prereq = {c: [] for c in range(N_cursos)}

    for crs, pre in prerequisitos:
        prereq[crs].append(pre)

    output = []
    visit, cycle = set(), set()

    def dfs(crs):
        if crs in cycle:
            return False
        if crs in visit:
            return True

        cycle.add(crs)
        for pre in prereq[crs]:
            if dfs(pre) == False:
                return False

        cycle.remove(crs)
        visit.add(crs)
        output.append(crs)

        return True

    for c in range(N_cursos):
        #Se detectó un ciclo
        if dfs(c) == False:
            return []

    return output

#LC 198
"""Máxima cantidad de dinero que se puede robar sin robar casas adyacentes"""
def lc198(casas: List[int]) -> int:
    #Programación dinámica: en cada casa se elige entre saltarla (mejor acumulado hasta la casa anterior)
    #o robarla (mejor acumulado hasta 2 casas atrás + el valor de esta casa)
    anterior = 0  # mejor acumulado hasta la casa i-2
    actual = 0    # mejor acumulado hasta la casa i-1

    for casa in casas:
        anterior, actual = actual, max(actual, anterior + casa)

    return actual

#LC 218
"""Dadas las coordenadas (x) donde inician y terminan los edificios y sus alturas (y) retornar el perfil de la ciudad (contorno de todos los edificios)"""
def lc218(buildings: List[List[int]]) -> List[List[int]]:
    events = []
    for L, R, H in buildings:
        events.append((L, -H, R))
        events.append((R, 0, 0))

    events.sort()
    hp = [(0, float('inf'))]
    ans = []

    for x, neg_h, r in events:
        while hp[0][1] <= x:
            heapq.heappop(hp)
        if neg_h < 0:
            heapq.heappush(hp, (neg_h, r))

        curr_max = -hp[0][0]
        if not ans or ans[-1][1] != curr_max:
            ans.append([x, curr_max])

    return ans

#LC 617
"""Sobreponer 2 árboles binarios, sumando los valores de los nodos que se sobrepongan, si un nodo es nulo se cuenta como 0.
    Se debe iniciar desde la raíz de ambos árboles y retornar la raíz a un nuevo árbol"""
def lc617(arbol1: Optional[TreeNode], arbol2: Optional[TreeNode]) -> Optional[TreeNode]:
    if not arbol1 and not arbol2:
        return None

    #Copiar ambos nodos (si tienen un valor no nulo)
    v1 = arbol1.val if arbol1 else 0
    v2 = arbol2.val if arbol2 else 0

    root = TreeNode(v1 + v2)

    root.left = lc617(arbol1.left if arbol1 else None, arbol2.left if arbol2 else None)
    root.right = lc617(arbol1.right if arbol1 else None, arbol2.right if arbol2 else None)

    return root

#LC 236
"""Dado un arbol binario encontrar el ancestro comun mas bajo (LCA) de 2 nodos determinados"""
def lc236(raiz: Optional[TreeNode], p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
    #Caso base: árbol vacío o se encontró uno de los nodos
    if not raiz or raiz == p or raiz == q:
        return raiz

    izq = lc236(raiz.left, p, q)
    der = lc236(raiz.right, p, q)

    #Un nodo en cada lado: la raíz actual es el LCA
    if izq and der:
        return raiz

    #Ambos nodos están del mismo lado (o solo se encontró uno)
    return izq or der

#LC 235
"""Igual que el LC 236 pero el árbol es un árbol binario de búsqueda (BST), lo que permite una solución iterativa O(h)"""
def lc235(raiz: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    actual = raiz

    while actual:
        if p.val > actual.val and q.val > actual.val:
            actual = actual.right
        elif p.val < actual.val and q.val < actual.val:
            actual = actual.left
        else:
            return actual

#LC 200
"""Dada una matriz con solo 0s (agua) y 1s (tierra) contar la cantidad de islas.
	Isla: pedazo de tierra rodeado por agua"""
def lc200(matriz: List[List[str]]) -> int:
    if not matriz:
        return 0

    filas = len(matriz)
    columnas = len(matriz[0])

    visitados = set()

    islas = 0

    def bfs(fila_ini, col_ini):
        cola = collections.deque()
        visitados.add((fila_ini, col_ini))
        cola.append((fila_ini, col_ini))
        direcciones = [[1, 0], [-1, 0], [0, 1], [0, -1]]

        while cola:
            fila, columna = cola.popleft()

            for dr, dc in direcciones:
                nf, nc = fila + dr, columna + dc
                if (nf in range(filas) and nc in range(columnas)
                    and matriz[nf][nc] == "1" and (nf, nc) not in visitados):
                    cola.append((nf, nc))
                    visitados.add((nf, nc))

    for f in range(filas):
        for c in range(columnas):
            if matriz[f][c] == "1" and (f, c) not in visitados:
                bfs(f, c)
                islas += 1

    return islas

#LC 238
"""Dado un arreglo de enteros "nums" devolver un arreglo solucion donde solucion[i] sea el producto de
	todos los elementos de nums, salvo por nums[i]. Se debe resolver en tiempo lineal y sin dividir """
def lc238(nums: List[int]) -> List[int]:
    prods = [1] * len(nums)

    prefijo = 1
    for i in range(len(nums)):
        prods[i] = prefijo
        prefijo *= nums[i]

    posfijo = 1
    for i in range(len(nums) - 1, -1, -1):
        prods[i] *= posfijo
        posfijo *= nums[i]

    return prods


#LC 253
"""Se entrega una lista de intervalos de tiempos de reuniones ordenadas por su hora de inicio. Retornar cantidad minima de
	salas para que todas las reuniones se puedan llevar a cabo
	intervalos [hora_inicio, hora_fin]"""
def lc253(intervalos: List[List[int]]) -> int:
    #Se divide en 2 arreglos ordenados, uno para las horas de inicio y otro para las de fin
    inicios = sorted(i[0] for i in intervalos)
    finales = sorted(i[1] for i in intervalos)

    resultado = 0
    contador_reuniones = 0
    s, e = 0, 0

    while s < len(intervalos):
        if inicios[s] < finales[e]:
            s += 1
            contador_reuniones += 1
        else:
            e += 1
            contador_reuniones -= 1

        resultado = max(resultado, contador_reuniones)

    return resultado