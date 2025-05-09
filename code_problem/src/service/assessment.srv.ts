// Helper function to parse input string into parameters
export function parseInputString(inputStr: string): any[] {
  // Remove any whitespace at start and end
  inputStr = inputStr.trim();

  // Create an array to store the extracted parameters
  const params: any[] = [];

  // Process each key-value pair
  const keyValuePairs = inputStr.split(/,\s*(?![^\[]*\])/);

  for (const pair of keyValuePairs) {
    // Extract the value (we don't need the key)
    let value;
    if (pair.includes('=')) {
      value = pair.split('=')[1].trim();
    } else {
      value = pair.trim();
    }

    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      // It's an array, extract contents and parse each element
      const arrayString = value.slice(1, -1);
      if (arrayString.trim() === '') {
        params.push([]);
      } else {
        const arrayElements = arrayString.split(',').map((element) => parseValue(element.trim()));
        params.push(arrayElements);
      }
    } else {
      // It's a simple value
      params.push(parseValue(value));
    }
  }

  return params;
}

// Helper function to parse different types of values
export function parseValue(value: string): any {
  value = value.trim();

  // Check for common types
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;

  // Check if it's a number
  if (!isNaN(Number(value)) && value !== '') {
    return Number(value);
  }

  // Check if it's a string with quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Return as is for anything else
  return value;
}
