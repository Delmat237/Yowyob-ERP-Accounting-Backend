import os
import re

# Extensions à inclure (utiles à la compréhension)
INCLUDED_EXTENSIONS = (".ts", ".tsx", ".js", ".md", ".txt", ".mjs")

# Fichiers/dossiers à ignorer par nom ou préfixe
IGNORED_PREFIXES = (".git", ".vscode", "node_modules", "__pycache__", '.next')

# Extensions à ignorer explicitement
IGNORED_EXTENSIONS = (
    ".json", ".svg", ".ico", ".png", ".jpg", ".jpeg", ".webp", '.ico',
    ".ttf", ".woff", ".woff2", ".eot", ".mp4", ".mp3", '.gitignore', '.mjs'
)

# Motifs pour fichiers de configuration à exclure
CONFIG_FILE_PATTERNS = [
    re.compile(r".*\.config\..*"),
    re.compile(r"^\.?eslint.*"),
    re.compile(r"^\.?prettier.*"),
    re.compile(r"^tsconfig.*"),
    re.compile(r"^postcss.*"),
    re.compile(r"^next\.config\..*"),
    re.compile(r"^pnpm-lock\.yaml$"),
    re.compile(r"^package\.json$"),
    re.compile(r"^env\..*"),
]

def is_config_file(filename: str) -> bool:
    return any(pattern.match(filename) for pattern in CONFIG_FILE_PATTERNS)

def should_skip(path: str, filename: str) -> bool:
    # Ignore fichiers/dossiers cachés ou techniques
    parts = path.split(os.sep)
    if any(part.startswith(IGNORED_PREFIXES) for part in parts):
        return True
    if filename.startswith(IGNORED_PREFIXES):
        return True

    # Ignore config files ou fichiers non inclus
    if filename.endswith(IGNORED_EXTENSIONS):
        return True
    if is_config_file(filename):
        return True

    # N'inclure que les extensions pertinentes
    if not filename.endswith(INCLUDED_EXTENSIONS):
        return True

    return False

def concat_files(root_dir: str, output_file: str):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for dirpath, _, filenames in os.walk(root_dir):
            for filename in filenames:
                if should_skip(dirpath, filename):
                    continue

                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        relative_path = os.path.relpath(file_path, root_dir)
                        outfile.write(f"\n--- FILE: {relative_path} ---\n")
                        outfile.write(infile.read())
                        outfile.write("\n")
                except Exception as e:
                    print(f"❌ Erreur lecture {file_path} : {e}")

    print(f"\n✅ Fichier généré : {output_file}")

# Exemple d'utilisation
if __name__ == "__main__":
    dossier_source = "."  # À adapter
    fichier_sortie = "../dashboard-3.txt"
    concat_files(dossier_source, fichier_sortie)