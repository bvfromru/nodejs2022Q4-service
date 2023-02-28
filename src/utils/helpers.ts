import * as bcrypt from 'bcrypt';
import { CRYPT_SALT } from 'src/main';

export const hashData = async (data: string) => bcrypt.hash(data, CRYPT_SALT);
