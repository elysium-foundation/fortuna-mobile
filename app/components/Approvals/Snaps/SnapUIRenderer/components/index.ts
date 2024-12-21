import { box } from './box';
import { text } from './text';
import { row } from './row';
import { address } from './address';
import { Button } from './button';
import { input } from './input';
import { bold } from './bold';
import { value } from './value';
import { card } from './card';
import { footer } from './footer';
import { container } from './container';

export const COMPONENT_MAPPING = {
  Box: box,
  Text: text,
  Row: row,
  Address: address,
  Button,
  Input: input,
  Bold: bold,
  Value: value,
  Card: card,
  Footer: footer,
  Container: container,
};
