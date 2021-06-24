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
    // let attArr: DOMmapType['atts'] = Array.prototype.map<AttsType>((attribute) => {
    //     return {
    //         att: (attribute.name as string),
    //         value: (attribute.value as string)
    //     }
    //     // attArr.push({
    //     //     att: (attribute.name as string),
    //     //     value: (attribute.value as string)
    //     // })
    // })

    // Array.prototype.map.call(attributes, (attribute) => {
    //     return {
    //         att: (attribute.name as string),
    //         value: (attribute.value as string)
    //     }
    //     // attArr.push({
    //     //     att: (attribute.name as string),
    //     //     value: (attribute.value as string)
    //     // })
    // })
    // return attArr
    return Array.prototype.map.call(attributes, function (attribute) {
        return {
            att: attribute.name,
            value: attribute.value
        };
    });
};

export function diff(virtualDom: DOMmapType[], realDom: DOMmapType[], realNode: HTMLElement | Node | ChildNode) {
    console.log('diff start:', virtualDom, realDom)
    let count = realDom.length - virtualDom.length;
    console.log('diff count:', count)

    // remove
    if (count > 0) {
        console.log('diff remove лишнее:')
        // значит удаляем лишнее
        for (; count > 0; count--) {
            realDom[realDom.length - count].node.parentNode?.removeChild(realDom[realDom.length - count].node)
        }
    }

    // diff
    virtualDom.forEach((node, index) => {
        // add
        if (!realDom[index]) {
            console.log('diff: add ', virtualDom[index])
            realNode.appendChild(createElement(virtualDom[index]))
            return
        }

        // Если элемент не того же типа, заменяем его новым элементом
        if (virtualDom[index].type !== realDom[index].type) {
            console.log('diff: update ', virtualDom[index])
            realDom[index].node.parentNode?.replaceChild(createElement(virtualDom[index]), realDom[index].node)
            return
        }

        // Если контент отличается, обновляем его
        if (virtualDom[index].content !== realDom[index].content) {
            console.log('diff: update content ', realDom[index].node.textContent, '->', virtualDom[index].content)
            realDom[index].node.textContent = virtualDom[index].content
            return
        }

        // удаление дочерних элементов
        // if (realDom[index].children) {
        //     console.log('diff: delete child ')
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
            console.log('diff: diff -> diff child ')
            if (realDom[index].children) {
                diff(node.children, realDom[index].children!, realDom[index].node);
            }
        }
    })
    console.log('diff end:', virtualDom, realDom, createDOMmap(realNode))
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