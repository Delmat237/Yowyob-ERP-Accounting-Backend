import pyautogui
import time

# Récupère les dimensions de l'écran
screen_width, screen_height = pyautogui.size()

# Coordonnées du centre de la moitié gauche (horizontalement)
x1 = screen_width // 4
y1 = screen_height // 2

# Coordonnées du centre de la moitié droite (horizontalement)
x2 = (3 * screen_width) // 4
y2 = screen_height // 2

print(f"Lancement du script... Cliquez à ({x1}, {y1}) puis ({x2}, {y2}) chaque 60 secondes.")

try:
    while True:
        # Clique dans la moitié gauche
        pyautogui.moveTo(x1, y1, duration=0.2)
        pyautogui.click()
        print(f"Cliqué à gauche à ({x1}, {y1})")

        time.sleep(0.5)  # petite pause entre les deux clics

        # Clique dans la moitié droite
        pyautogui.moveTo(x2, y2, duration=0.2)
        pyautogui.click()
        print(f"Cliqué à droite à ({x2}, {y2})")

        # Attente de 60 secondes
        time.sleep(60)

except KeyboardInterrupt:
    print("Script arrêté manuellement.")
