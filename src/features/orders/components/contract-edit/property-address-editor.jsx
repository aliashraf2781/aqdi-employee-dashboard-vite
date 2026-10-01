import { Link2 } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ADDRESS_FIELDS } from '../../lib/contract-fields';
import { resolveNationalAddress } from '../../lib/national-address';
import { absolutizeMediaUrl } from '../../lib/media-url';
import { getOrderAddressStep } from '../../lib/order-detail-steps';
import { pick } from '../../lib/pick';
import { useSectionEditor } from '../details/section-editor-context';
import { AddressImageViewer } from './address-image-viewer';
import { ContractStepForm } from './contract-step-form';
import { PropertyLocationCard } from './property-location-card';

/** Editor of the national address, with the address card image and the map link shown above the form. */
export function PropertyAddressEditor({ order }) {
  const sectionEditor = useSectionEditor();
  const formRef = useRef(null);
  const [pickedImage, setPickedImage] = useState(undefined);

  const savedImage = absolutizeMediaUrl(pick(getOrderAddressStep(order).image_address, order?.image_address));
  const hasPickedImage = pickedImage instanceof File || (typeof pickedImage === 'string' && pickedImage.trim());
  const previewSource = hasPickedImage ? pickedImage : savedImage;

  const location = useMemo(() => {
    const address = resolveNationalAddress(order);
    return address.maps_url ? address : null;
  }, [order]);

  // Keeps the preview in step with the file input of the form.
  const handleFormChange = useCallback((values) => {
    if (!values || !Object.hasOwn(values, 'image_address')) return;
    setPickedImage((current) => (Object.is(current, values.image_address) ? current : values.image_address));
  }, []);

  const replaceImage = (file) => {
    setPickedImage(file);
    formRef.current?.setField('image_address', file);
  };

  return (
    <div className="space-y-6">
      {(previewSource || location) && (
        <div className="space-y-5 rounded-card border border-border bg-muted p-6">
          {previewSource && <AddressImageViewer source={previewSource} onReplace={replaceImage} />}
          {location && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Link2 className="size-3.5" />
                الموقع على الخريطة
              </div>
              <PropertyLocationCard location={location} />
            </div>
          )}
        </div>
      )}

      <h4 className="border-b border-border pb-2 text-sm font-bold text-muted-foreground">العنوان الوطني للعقار</h4>
      <ContractStepForm ref={formRef} step="step2" fields={ADDRESS_FIELDS} onFormChange={handleFormChange} onCancel={sectionEditor?.onClose} />
    </div>
  );
}
