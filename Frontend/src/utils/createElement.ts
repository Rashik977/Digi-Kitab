// function to create an element with the given tag, props and children
//Children can be strings or elements
export const createElement = (
  tag: string,
  props: any = {},
  ...children: any[]
) => {
  const element: HTMLElement = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    (element as any)[key] = value;
  });
  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
};
