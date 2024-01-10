var labels = 
{
    "es-mx":
    {
        "AddPart":
        {
            "1": "Nombre",
            "2": "Ingrese el nombre para el nuevo producto",
            "3": "El nombre del nuevo producto",
            "4": "El nombre para el nuevo producto a registrar en la plataforma de EP&O. Este le ayudará a identificar el producto con nombre amigable.",
            "5": "Número de parte",
            "6": "Ingrese el número de parte",
            "7": "El número de parte del nuevo producto",
            "8": "Este número de parte le permitirá identificar de manera unica sus productos utilizando su propia nomenclatura. No hay de que preocuparse, no nos perderemos.",
            "9": "Cantidad maxima",
            "10": "Ingrese la cantidad máxima que puede surtir en una órden",
            "11": "Necesitamos esta cantidad para poder controlar nuestros pedido y no sobrecargar su capacidad, debes agregar la cantidad maxima que pudes surtir de este producto.",
            "12": "Activo",
            "13": "Un producto activo es tomado en cuenta para órdenes. Puede desactivar un producto en otro momento en caso de ser necesario",
            "14": "Ubicación",
            "15": "¿Dónde se encuentra el producto?",
            "16": "",
            "17": "Recuerda que este es el precio por número de parte, es decir por unidad y debe ir LIBRE DE IVA.",
            "18": "Cantidad minima",
            "19": "Aqui deberás ingresar la cantidad minima que deberías tener para este producto.",
            "20": "Ingrese la cantidad minima para este producto.",
            "21": "Agregar precio",
            "22": "Unidades disponibles",
            "23": "Agregar las unidades que tienes disponibles para este producto.",
            "24": "Recuerda indicar cuantas unidades tienes disponibles para este producto, estas apareceran en la descripción del mismo.",
        },
        "RangeSummary":
        {
            "1": "Mínimo",
            "2": "Máximo",
            "3": "Promedio"
        }
    },
    "en-us":
    {
        "AddPart":
        {
            "1": "Name",
            "2": "Please input a name for the part",
            "3": "The name of the new part",
            "4": "The name for the new part to be submitted into EP&O's platform. It will help you identify the part with a friendly name.",
            "5": "Part Number",
            "6": "Please input the part number",
            "7": "The part number of the new part",
            "8": "This field allows you to keep trak of the real identifier within your own nomenclature of part numbers. Do not worry, we will not get lost.",
            "9": "Quantity",
            "10": "Please input the maximum quantity you can provide in a single order",
            "11": "We need this number to control our orders and to not overload your capacity",
            "12": "Active",
            "13": "An active product is taken in consideration for incoming orders. You may deactivate a product later if you need it"
        },
        "RangeSummary":
        {
            "1": "Minumum",
            "2": "Maximum",
            "3": "Average"
        }
    }
};
export default function getLabel(component, labelNo) {
    const prefix = 'lang';
    const lang = 'es-mx';
    var start = document.cookie.indexOf(prefix + "=");
    if (start == -1)
    {
        console.log("no existe?");
        document.cookie = prefix + "=" + lang;
    }
    const value = "; " + document.cookie;
    const kv = value.split("; " + prefix + "=");
    return kv.length == 2 ? labels[kv.pop().split(';').shift()][component][labelNo] : "Undefined Label";
}