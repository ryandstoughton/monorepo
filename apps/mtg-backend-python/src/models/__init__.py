import pkgutil
import importlib
from pathlib import Path

package_dir = Path(__file__).parent

for finder, module_name, is_pkg in pkgutil.iter_modules([str(package_dir)]):
    print(f"name is {__name__}")
    print(f"module_name is {module_name}")
    print(f"exporting from models {__name__}.{module_name}")
    importlib.import_module(f"{__name__}.{module_name}")