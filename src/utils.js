import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const logError = ($prexLog, code, error) => {
    console.log($prexLog, error.message)
    return {
        'success': false,
        'code': code,
        'message': `Ha ocurrido un error inesperado, intente más tarde`,
        'messageError': `: ${error.message}`,
    }
}