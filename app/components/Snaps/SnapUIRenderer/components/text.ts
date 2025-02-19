import { JSXElement } from '@metamask/snaps-sdk/jsx';
import { getJsxChildren } from '@metamask/snaps-utils';
import { NonEmptyArray } from '@metamask/utils';
import { mapTextToTemplate } from '../utils';
import { UIComponentFactory } from './types';
import {
  TextColor,
  TextVariant,
} from '../../../../component-library/components/Texts/Text/Text.types';

type TextProps = JSXElement & {
  type: 'Text';
  props: {
    children: string | JSXElement[];
    color?:
      | 'default'
      | 'alternative'
      | 'muted'
      | 'error'
      | 'success'
      | 'warning';
    fontWeight?: 'bold' | 'medium' | 'regular';
    size?: 'sm' | 'md';
    alignment?: string;
  };
};

function getTextColor(color: TextProps['props']['color']) {
  switch (color) {
    case 'default':
      return TextColor.Default;
    case 'alternative':
      return TextColor.Alternative;
    case 'muted':
      return TextColor.Muted;
    case 'error':
      return TextColor.Error;
    case 'success':
      return TextColor.Success;
    case 'warning':
      return TextColor.Warning;
    default:
      return TextColor.Default;
  }
}

function getFontWeight(color: TextProps['props']['fontWeight']) {
  switch (color) {
    case 'bold':
      return 'bold';
    case 'medium':
      return 'medium';
    case 'regular':
    default:
      return 'normal';
  }
}

const alignText = (alignment: TextProps['props']['alignment']) => {
  switch (alignment) {
    case 'start':
      return 'left';
    case 'center':
      return 'center';
    case 'end':
      return 'right';
    default:
      return 'left';
  }
};

export const text: UIComponentFactory<TextProps> = ({
  element: e,
  ...params
}) => ({
  element: 'Text',
  children: mapTextToTemplate(
    getJsxChildren(e) as NonEmptyArray<string | JSXElement>,
    params,
  ),
  props: {
    variant: e.props.size === 'sm' ? TextVariant.BodySM : TextVariant.BodyMD,
    fontWeight: getFontWeight(e.props.fontWeight),
    color: getTextColor(e.props.color),
    textAlign: alignText(e.props.alignment),
  },
});
