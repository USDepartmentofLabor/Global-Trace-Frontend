declare module '@sum.cumo/vue-datepicker' {
  declare class VueDatePicker extends Vue {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    clearDate: () => void;
  }
  export type Range = {
    from: Date;
    to: Date;
  };
  export type DisabledDates = {
    ranges?: Range[];
    days?: number[];
    daysOfMonth?: number[];
    dates?: Date[];
    to?: Date;
    from?: Date;
  };
  export default VueDatePicker;
}
