import { Button } from "./Button";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary = {
  args: {
    primary: true,
    label: "Button",
  },
} satisfies Story;

export const Secondary = {
  args: {
    label: "Button",
  },
} satisfies Story;

export const Large = {
  args: {
    size: "large",
    label: "Button",
  },
} satisfies Story;

export const Small = {
  args: {
    size: "small",
    label: "Button",
  },
} satisfies Story;
