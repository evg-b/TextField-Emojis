/**
 * Воссоздать DOM diffing сама по себе интересная задача
 * Тут урезанный функционал, для отслеживания highlight в реальном времени.
*/
type AttsType = {
    att: string, value: string
}
type DOMmapType = {
    content: string | null
    type: string,
    node: Node
    atts?: AttsType[]
    children?: DOMmapType[]
}

export function stringToHTML(value: string) {
    let parser = new DOMParser()
    let doc = parser.parseFromString(value, 'text/html')
    return doc.body
}

export function createDOMmap(dom: HTMLElement | Node | ChildNode) {
    let domMap: DOMmapType[] = []
    dom.childNodes.forEach(node => {

        domMap.push(
            {
                content: node.textContent,
                type: node.nodeType === 3 ? 'text' : (node.nodeType === 8 ? 'comment' : node.nodeName.toLowerCase()),
                atts: node.nodeType !== 1 ? [] : (getAttributes((node as Element).attributes) as AttsType[]),
                node: node,
                children: createDOMmap(node)
            }
        )
    })
    return domMap
}

function getAttributes(attributes: NamedNodeMap) {
    return Array.prototype.map.call(attributes, function (attribute) {
        return {
            att: attribute.name,
            value: attribute.value
        };
    });
};

export function diff(virtualDom: DOMmapType[], realDom: DOMmapType[], realNode: HTMLElement | Node | ChildNode) {
    let count = realDom.length - virtualDom.length;

    // remove
    if (count > 0) {
        // значит удаляем лишнее
        for (; count > 0; count--) {
            realDom[realDom.length - count].node.parentNode?.removeChild(realDom[realDom.length - count].node)
        }
    }

    // diff
    virtualDom.forEach((node, index) => {
        // add
        if (!realDom[index]) {
            realNode.appendChild(createElement(virtualDom[index]))
            return
        }

        // Если элемент не того же типа, заменяем его новым элементом
        if (virtualDom[index].type !== realDom[index].type) {
            realDom[index].node.parentNode?.replaceChild(createElement(virtualDom[index]), realDom[index].node)
            return
        }

        // Если контент отличается, обновляем его
        if (virtualDom[index].content !== realDom[index].content) {
            realDom[index].node.textContent = virtualDom[index].content
            return
        }

        // подумаю еще включать или нет
        // удаление дочерних элементов
        // if (realDom[index].children) {
        //     realDom[index].node.nodeValue = ''
        //     return
        // }


        if (realDom[index].children && node.children) {

            let fragment = document.createDocumentFragment();
            diff(node.children, realDom[index].children!, fragment);
            realNode.appendChild(fragment);
            return;
        }
        // если есть дочерние элементы, ищем различия в рекурсии
        if (node.children) {
            if (realDom[index].children) {
                diff(node.children, realDom[index].children!, realDom[index].node);
            }
        }
    })
}


function createElement(vNode: DOMmapType) {
    // Create the element
    let node: Node
    if (vNode.type === 'text') {
        node = document.createTextNode(vNode.content!)
    } else {
        node = document.createElement(vNode.type)
    }

    addAttributes((node as Element), vNode.atts)

    // создаем дочерние элементы если имеются
    if (vNode.children) {
        vNode.children.forEach(function (childElem) {
            node.appendChild(createElement(childElem))
        })
    } else if (vNode.type !== 'text') {
        node.textContent = vNode.content;
    }

    return node;
}

function addAttributes(elem: Element, atts?: AttsType[]) {
    atts && atts.forEach(function (attribute) {
        if (attribute.att === 'class') {
            elem.className = attribute.value;
        } else {
            elem.setAttribute(attribute.att, attribute.value);
        }
    });
};