
/**
 *
 * @param response {HTTP Response} Response provided by a request
 * @returns {Promise<string>} Promise with html string parsed to UTF-8 encoding
 */

export const getUtf8Text = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('Content-Type');
  const charsetMatch = contentType?.match(/charset=([a-zA-Z0-9-]+)/);
  const charset = charsetMatch ? charsetMatch[1] : 'utf-8'; // Por defecto UTF-8 si no se encuentra el charset
  const decoder = new TextDecoder(charset);
  const decodedText = decoder.decode(await response.arrayBuffer());
  return decodedText;
};

/**
 *
 * @param seconds Number of timeout seconds
 * @returns a Promise that resolves in the time specified
 */
export function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

