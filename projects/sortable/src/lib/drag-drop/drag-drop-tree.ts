
export interface CdkDropDownItem {
    [key: string]: any; // a CdkDropDownItem will be an unknown data model
    children?: CdkDropDownItem[]; // we can require `children[]` 
}


export interface CdkIndexTree {
    root: CdkIndexTreeNode,
    dropItems: CdkDropDownItem[],
}

export interface CdkIndexTreeNode {

    parent?: CdkIndexTreeNode,

    itemOfList: CdkDropDownItem,

    indexOfList: number,

    children?: CdkIndexTreeNode[],
}

export function getDecendantCount(parent: CdkDropDownItem): number {
    let count = 1;

    if (parent.children && parent.children.length > 0) {
        for (let child of parent.children) {
            count += getDecendantCount(child);
        }
    }

    return count;
}

export function getTotalCount(parents: CdkDropDownItem[]): number {
    let count = 0;
    for (const parent of parents) {
        count += getDecendantCount(parent);
    }

    return count;
}

export function buildTree(children: CdkDropDownItem[]) : CdkDropDownItem {
    return {
        _isEmpty: true,
        children
    }
}

export function constructCdkIndexTree(rootNode: CdkDropDownItem): CdkIndexTree {
    const root = _constructCdkIndexTreeNode(rootNode, -1).indexNode;

    const dropItems = [];

    const itemCount = getDecendantCount(rootNode) - 1;

    for (let i = 0; i < itemCount; i++)
        dropItems.push(rootNode);


    _traverseCdkIndexTree(root, (node: CdkIndexTreeNode) => {
        if (node.indexOfList !== -1)
            dropItems[node.indexOfList] = node.itemOfList;
    });

    return {
        root,
        dropItems
    }
}

function _traverseCdkIndexTree(root: CdkIndexTreeNode, cb: (node: CdkIndexTreeNode) => void) {

    cb(root);
    if (root.children && root.children.length > 0) {
        for (let child of root.children) {
            _traverseCdkIndexTree(child, cb);
        }
    }
}

function _constructCdkIndexTreeNode(node: CdkDropDownItem, index: number, parent?: CdkIndexTreeNode): { indexNode: CdkIndexTreeNode, index: number } {
    let indexNode: CdkIndexTreeNode = {
        indexOfList: index,
        itemOfList: node,
        parent: parent,
    }

    index++;

    if (node.children && node.children.length > 0) {
        let children: CdkIndexTreeNode[] = [];

        for (let child of node.children) {
            const { indexNode: childIndexNode, index: newIndex } = _constructCdkIndexTreeNode(child, index, indexNode);
            children.push(childIndexNode);
            index = newIndex;

        }

        indexNode.children = children;
    }

    return {
        indexNode,
        index
    };

}

// export function getIndexOfNode(tree : CdkDropDownItem[], ) {

// }

export function splitTree(tree: CdkIndexTree, startIndex: number, endIndex: number): CdkDropDownItem {


    return _splitTree(tree.root, startIndex, endIndex).newDropItem;

}

function _splitTree(node: CdkIndexTreeNode, startIndex: number, endIndex: number): { newDropItem: CdkDropDownItem, hasReached: boolean } {

    const children = node.children;

    // const newDropItem = Object.assign(node.itemOfList);
    let newDropItem: CdkDropDownItem = {};

    let newDropChildren: CdkDropDownItem[] = [];

    let hasReached = false;

    if (node.indexOfList < startIndex || node.indexOfList > endIndex)
        newDropItem._isEmpty = true;
    else
        newDropItem = Object.assign({}, node.itemOfList, { children: undefined });


    if (node.indexOfList == endIndex) {
        return { newDropItem, hasReached: true };
    }


    if (children && children.length > 0) {
        for (let index = 0; index < children.length; index++) {
            const child = children[index];
            if (index < children.length - 1 && startIndex >= children[index + 1].indexOfList)
                continue;

            if (endIndex < child.indexOfList)
                continue;

            const { newDropItem: subtree, hasReached: reached } = _splitTree(child, startIndex, endIndex);

            newDropChildren.push(subtree);

            hasReached = reached;

            if (hasReached) {
                break;
            }


        };

    }

    if (newDropChildren.length > 0)
        newDropItem.children = newDropChildren;

    return { newDropItem, hasReached };


}
