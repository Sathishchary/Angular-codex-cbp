export class Image {
  fileName!: string;
  caption = '';
  dgUniqueID!: string;
  dgType = 'Figures';
  type = 'media';
  dataType = 'image';
  subType = '';
  name = 'image';
  label = 'Figure';
  images = [];
  isDataEntry = true;
  captionText = false;
}

export interface SingleImageProperties {
  fileName: string,
  caption?: string,
  dgUniqueID: string,
  dgType: string,
  source: string;
  name?: string;
  label?: string;
  description?: string;
  fileType?: string;
  index?: number;
  action?: number;
  type?: string;
}
