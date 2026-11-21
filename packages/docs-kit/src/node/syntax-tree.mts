import type { Nodes as HastNodes } from 'hast';
import type { Nodes as MdastNodes } from 'mdast';

// The two tree helpers the compiler needs, for the markdown tree (mdast) and the HTML tree
// (hast) alike: visiting the nodes of a type, and reading a node's text.

type SyntaxNode = MdastNodes | HastNodes;

interface SyntaxParent {
  children: SyntaxNode[];
}

/** Returned by a visitor: the node's children are not visited (e.g. it was replaced) */
const SKIP = 'skip';

type Visitor<N> = (
  node: N,
  index: number | undefined,
  parent: SyntaxParent | undefined,
) => typeof SKIP | void;

/**
 * Calls {visitor} for each node of {type} in {tree}, parents before their children. A visitor
 * may replace the node in `parent.children[index]`, then return `'skip'`.
 */
function visit<T extends SyntaxNode['type']>(
  tree: SyntaxNode,
  type: T,
  visitor: Visitor<Extract<SyntaxNode, { type: T }>>,
): void {
  const walk = (
    node: SyntaxNode,
    index: number | undefined,
    parent: SyntaxParent | undefined,
  ) => {
    if (
      node.type === type &&
      visitor(node as Extract<SyntaxNode, { type: T }>, index, parent) === SKIP
    ) {
      return;
    }

    if ('children' in node) {
      const nodeAsParent = node as SyntaxParent;

      nodeAsParent.children.forEach((child, childIndex) =>
        walk(child, childIndex, nodeAsParent),
      );
    }
  };

  walk(tree, undefined, undefined);
}

/** The text of a node, as read: markup dropped, inline code kept, raw HTML without its tags */
function nodeToText(node: SyntaxNode): string {
  if (node.type === 'html' || node.type === 'raw') {
    return node.value.replace(/<[^>]*>/g, '');
  }

  if (node.type === 'comment') return '';
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('children' in node) {
    return (node.children as SyntaxNode[]).map(nodeToText).join('');
  }

  return '';
}

export { SKIP, nodeToText, visit };
