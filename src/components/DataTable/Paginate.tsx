import { Vue, Component, Prop } from 'vue-property-decorator';
import { map } from 'lodash';
import classnames from 'classnames';
import * as Styled from './styled';

@Component
export default class Paginate extends Vue {
  @Prop({ required: true, type: Number }) readonly pageCount: number;
  @Prop({ type: Number }) readonly forcePage: number;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  pageOnChange: (page: number) => void;
  @Prop({ default: 3, type: Number }) readonly pageRange: number;
  @Prop({ default: 1, type: Number }) readonly marginPages: number;
  @Prop({ default: 'Prev', type: String }) readonly prevText: string;
  @Prop({ default: 'Next', type: String }) readonly nextText: string;
  @Prop({ default: '...', type: String }) readonly breakViewText: string;
  @Prop({ default: '', type: String }) readonly containerClass: string;
  @Prop({ default: 'page-item', type: String }) readonly pageClass: string;
  @Prop({ default: '', type: String }) readonly pageLinkClass: string;
  @Prop({ default: '', type: String }) readonly prevClass: string;
  @Prop({ default: 'prev-page', type: String }) readonly prevLinkClass: string;
  @Prop({ default: '', type: String }) readonly nextClass: string;
  @Prop({ default: 'next-page', type: String }) readonly nextLinkClass: string;
  @Prop({ default: 'break-page', type: String })
  readonly breakViewClass: string;
  @Prop({ default: '', type: String }) readonly breakViewLinkClass: string;
  @Prop({ default: 'active', type: String }) readonly activeClass: string;
  @Prop({ default: 'disabled', type: String }) readonly disabledClass: string;
  @Prop({ default: 'First', type: String }) readonly firstActionText: string;
  @Prop({ default: 'Last', type: String }) readonly lastActionText: string;
  @Prop({ default: false, type: Boolean }) readonly isShowFirstLast: boolean;
  @Prop({ default: false, type: Boolean }) readonly isHidePrevNext: boolean;
  @Prop({ default: false, type: Boolean }) readonly isLoading: boolean;

  public page: number = 1;

  beforeUpdate(): void {
    if (this.forcePage && this.forcePage !== this.page) {
      this.page = this.forcePage;
    }
  }

  get firstPageSelected(): boolean {
    return this.page === 1;
  }

  get lastPageSelected(): boolean {
    return this.page === this.pageCount || this.pageCount === 0;
  }

  get pages(): App.DataTablePaginationDictionary {
    if (this.pageCount <= this.pageRange) {
      return this.getPagination();
    }
    return this.getPaginationBreakView();
  }

  setPageItem(
    paginationItems: App.DataTablePaginationDictionary,
    index: number,
  ): void {
    const page: App.DataTablePaginationItem = {
      index,
      content: index + 1,
      selected: index === this.page - 1,
    };
    paginationItems[index] = page;
  }

  setBreakView(
    paginationItems: App.DataTablePaginationDictionary,
    index: string | number,
  ): void {
    const breakView: App.DataTablePaginationItem = {
      disabled: true,
      breakView: true,
    };
    paginationItems[index] = breakView;
  }

  getSelectedRange(
    paginationItems: App.DataTablePaginationDictionary,
  ): App.PaginationRange {
    const halfPageRange = Math.floor(this.pageRange / 2);
    let selectedRangeLow = 0;
    for (let i = 0; i < this.marginPages; i++) {
      this.setPageItem(paginationItems, i);
    }
    if (this.page - halfPageRange > 0) {
      selectedRangeLow = this.page - 1 - halfPageRange;
    }
    let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
    if (selectedRangeHigh >= this.pageCount) {
      selectedRangeHigh = this.pageCount - 1;
      selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
    }
    return { selectedRangeLow, selectedRangeHigh };
  }

  getPagination(): App.DataTablePaginationDictionary {
    const paginationItems: App.DataTablePaginationDictionary = {};
    for (let index = 0; index < this.pageCount; index++) {
      const page: App.DataTablePaginationItem = {
        index,
        content: index + 1,
        selected: index === this.page - 1,
      };
      paginationItems[index] = page;
    }
    return paginationItems;
  }

  getPaginationBreakView(): App.DataTablePaginationDictionary {
    const paginationItems: App.DataTablePaginationDictionary = {};
    const { selectedRangeLow, selectedRangeHigh } =
      this.getSelectedRange(paginationItems);
    for (
      let i = selectedRangeLow;
      i <= selectedRangeHigh && i <= this.pageCount - 1;
      i++
    ) {
      this.setPageItem(paginationItems, i);
    }
    if (selectedRangeLow > this.marginPages) {
      this.setBreakView(paginationItems, selectedRangeLow - 1);
    }
    if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
      this.setBreakView(paginationItems, selectedRangeHigh + 1);
    }
    for (
      let i = this.pageCount - 1;
      i >= this.pageCount - this.marginPages;
      i -= 1
    ) {
      this.setPageItem(paginationItems, i);
    }
    return paginationItems;
  }

  handlePageSelected(page: number): void {
    if (this.page !== page) {
      this.page = page;
      this.$emit('input', page);
      this.pageOnChange(page);
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.handlePageSelected(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.pageCount) {
      this.handlePageSelected(this.page + 1);
    }
  }

  selectFirstPage(): void {
    if (this.page > 1) {
      this.handlePageSelected(1);
    }
  }

  selectLastPage(): void {
    if (this.page < this.pageCount) {
      this.handlePageSelected(this.pageCount);
    }
  }

  renderFirstPage(): JSX.Element {
    return (
      <Styled.ListItem
        isLoading={this.isLoading}
        isDisabled={this.firstPageSelected}
        class={classnames(this.pageClass, {
          [this.disabledClass]: this.firstPageSelected,
        })}
      >
        <Styled.ItemLink
          class={this.pageLinkClass}
          domProps={{
            innerHTML: this.firstActionText,
          }}
          isFirstPageLink
          tabIndex={this.firstPageSelected ? -1 : 0}
          onClick={() => this.selectFirstPage()}
        />
      </Styled.ListItem>
    );
  }

  renderLastPage(): JSX.Element {
    return (
      <Styled.ListItem
        isLoading={this.isLoading}
        isDisabled={this.lastPageSelected}
        class={classnames(this.pageClass, {
          [this.disabledClass]: this.lastPageSelected,
        })}
      >
        <Styled.ItemLink
          onClick={() => this.selectLastPage()}
          class={this.pageLinkClass}
          tabIndex={this.lastPageSelected ? -1 : 0}
          domProps={{
            innerHTML: this.lastActionText,
          }}
          isLastPageLink
        />
      </Styled.ListItem>
    );
  }

  renderPrevPage(): JSX.Element {
    return (
      <Styled.ListItem
        isLoading={this.isLoading}
        isDisabled={this.firstPageSelected}
        class={classnames(this.prevClass, {
          [this.disabledClass]: this.firstPageSelected,
        })}
      >
        <Styled.ItemLink
          class={this.prevLinkClass}
          domProps={{
            innerHTML: this.prevText,
          }}
          isPrevLink
          tabIndex={this.firstPageSelected ? -1 : 0}
          onClick={() => this.prevPage()}
        />
      </Styled.ListItem>
    );
  }

  renderNextPage(): JSX.Element {
    return (
      <Styled.ListItem
        isLoading={this.isLoading}
        isDisabled={this.lastPageSelected}
        class={classnames(this.nextClass, {
          [this.disabledClass]: this.lastPageSelected,
        })}
      >
        <Styled.ItemLink
          onClick={() => this.nextPage()}
          class={this.nextLinkClass}
          isNextLink
          tabIndex={this.lastPageSelected ? -1 : 0}
          domProps={{
            innerHTML: this.nextText,
          }}
        />
      </Styled.ListItem>
    );
  }

  renderListPage(
    page: App.DataTablePaginationItem,
    idx: number | string,
  ): JSX.Element {
    return (
      <Styled.ListItem
        key={idx.toString()}
        isLoading={this.isLoading}
        isActive={page.selected}
        isBreakView={page.breakView}
        isDisabled={page.disabled}
        class={classnames(this.pageClass, {
          [this.activeClass]: page.selected,
          [this.disabledClass]: page.disabled,
          [this.breakViewClass]: page.breakView,
        })}
      >
        {page.breakView && (
          <Styled.ItemLink
            class={classnames(this.pageLinkClass, this.breakViewLinkClass)}
            tabIndex={0}
          >
            {this.$slots.breakViewContent} {this.breakViewText}
          </Styled.ItemLink>
        )}
        {!page.breakView && page.disabled && (
          <Styled.ItemLink class={this.pageLinkClass} tabIndex={0}>
            {page.content}
          </Styled.ItemLink>
        )}
        {!page.breakView && !page.disabled && (
          <Styled.ItemLink
            onClick={() => this.handlePageSelected(page.index + 1)}
            class={this.pageLinkClass}
            tabIndex={0}
          >
            {page.content}
          </Styled.ItemLink>
        )}
      </Styled.ListItem>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Paginate class={this.containerClass}>
        {this.isShowFirstLast && this.renderFirstPage()}
        {!(this.firstPageSelected && this.isHidePrevNext) &&
          this.renderPrevPage()}
        {map(this.pages, (page: App.DataTablePaginationItem, idx) =>
          this.renderListPage(page, idx),
        )}
        {!(this.lastPageSelected && this.isHidePrevNext) &&
          this.renderNextPage()}
        {this.isShowFirstLast && this.renderLastPage()}
      </Styled.Paginate>
    );
  }
}
