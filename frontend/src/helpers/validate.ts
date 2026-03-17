const descriptionRegex = /^[a-zA-Z0-9\s.,&\-\/+:]+$/;
const durationRegex = /^\d+$/;

export function validate(title: string, description: string, duration: string, price: string, sections: any) {
  
  const errors: { [key: string]: string } = {};
  
  if (!title.trim()) {
    errors.title = 'Enter a valid title';
  }
  
  if (!descriptionRegex.test(description)) {
    errors.description = 'Enter a valid description';
  }
  
  if (!durationRegex.test(price)) {
    errors.price = 'Enter a valid price';
  }
  
  if (!durationRegex.test(duration)) {
    errors.duration = 'Enter a valid duration';
  }
  
  sections.forEach((section: any, index: number) => {
    if (!section.videoTitle.trim()) {
      errors[`sections[${index}].videoTitle`] = 'Enter a valid Section title';
    }
    
    if (!section.videoDescription.trim()) {
      errors[`sections[${index}].videoDescription`] = 'Enter a valid description';
    }
    
    if (!section.videoUrl.trim()) {
      errors[`sections[${index}].videoUrl`] = 'Upload section video !';
    }
  });
console.log(errors)
  return errors;
}
