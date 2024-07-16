// Third party dependencies
import React from 'react';
import { Meta, Story } from '@storybook/react-native';

// Internal dependencies
import CellDisplay from './CellDisplay';
import { CellDisplayProps } from './CellDisplay.types';
import { SAMPLE_CELLDISPLAY_PROPS } from './CellDisplay.constants';

export default {
  title: 'Component Library / Cells / CellDisplay',
  component: CellDisplay,
  argTypes: {
    title: { control: 'text' },
    secondaryText: { control: 'text' },
    tertiaryText: { control: 'text' },
    tagLabel: { control: 'text' },
  },
} as Meta;

const Template: Story<CellDisplayProps> = (args) => <CellDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {
  ...SAMPLE_CELLDISPLAY_PROPS,
};
