import { TypeItem } from './type-item';

export class PageType {
  id!: string;
  typeName!: string;
  desc!: string;
  items!: TypeItem[];
}
export default PageType;
