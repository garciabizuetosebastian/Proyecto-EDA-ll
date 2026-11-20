#LC 1
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        vistos = {}

        for indice, numero in enumerate(nums):
            complemento = target - numero
    
            if complemento in vistos:
                return [vistos[complemento], indice]

            vistos[numero] = indice
        #Si no se encontró
        return []

#LC 2
class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        dummy = ListNode(0)
        actual = dummy
        carry = 0

        while l1 or l2 or carry:
            v1 = l1.val if l1 else 0
            v2 = l2.val if l2 else 0

            total = v1 + v2 + carry
            carry = total // 10
            actual.next = ListNode(total % 10)
            actual = actual.next

            if l1:
                l1 = l1.next
            if l2:
                l2 = l2.next

        return dummy.next

#LC 3
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        mas_reciente = {}
        izq = 0
        max_len = 0

        for der, char in enumerate(s):
            if char in mas_reciente and mas_reciente[char] >= izq:
                izq = mas_reciente[char] + 1

            mas_reciente[char] = der
            max_len = max(max_len, der - izq + 1)

        return max_len

#LC 4
class Solution:
  def findMedianSortedArrays(
      self, nums1: List[int], nums2: List[int]
  ) -> float:
    if len(nums1) > len(nums2):
      nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    low, high = 0, m
    half_len = (m + n + 1) // 2

    while low <= high:
      i = (low + high) // 2
      j = half_len - i

      max_left1 = float("-inf") if i == 0 else nums1[i - 1]
      min_right1 = float("inf") if i == m else nums1[i]

      max_left2 = float("-inf") if j == 0 else nums2[j - 1]
      min_right2 = float("inf") if j == n else nums2[j]

      if max_left1 <= min_right2 and max_left2 <= min_right1:
        if (m + n) % 2 == 1:
          return float(max(max_left1, max_left2))
        return (
            max(max_left1, max_left2) + min(min_right1, min_right2)
        ) / 2.0

      elif max_left1 > min_right2:
        high = i - 1
      else:
        low = i + 1

    return 0.0

#LC 5
class Solution:

  def longestPalindrome(self, s: str) -> str:
    if not s:
      return ""

    start, max_len = 0, 1

    def expand(left: int, right: int) -> None:
      nonlocal start, max_len
      while left >= 0 and right < len(s) and s[left] == s[right]:
        curr_len = right - left + 1
        if curr_len > max_len:
          start = left
          max_len = curr_len
        left -= 1
        right += 1

    for i in range(len(s)):
      expand(i, i)  # palíndromos de longitud impar
      expand(i, i + 1)  # palíndromos de longitud par

    return s[start : start + max_len]