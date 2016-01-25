/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import Position from './position.js';
import Range from './range.js';

/**
 * TextFragment is an aggregator for multiple CharacterProxy instances that are placed next to each other in
 * tree model, in the same parent, and all have same attributes set. Instances of this class are created and returned
 * in various algorithms that "merge characters" (see {@link treeModel.TreeWalker}, {@link treeModel.Range}).
 *
 * Difference between {@link treeModel.TextFragment} and {@link treeModel.Text} is that the former is bound to tree model,
 * while {@link treeModel.Text} is simply a string with attributes set.
 *
 * You should never create an instance of this class by your own. When passing parameters to constructors,
 * use string literals or {@link treeModel.Text} instead.
 *
 * @class treeModel.TextFragment
 */
export default class TextFragment {
	/**
	 * Creates a text fragment.
	 *
	 * @param {treeModel.Position} startPosition Position in the tree model where the {@link treeModel.TextFragment} starts.
	 * @param {String} text Characters contained in {@link treeModel.TextFragment}.
	 * @protected
	 * @constructor
	 */
	constructor( startPosition, text ) {
		/**
		 * First {@link treeModel.CharacterProxy character node} contained in {@link treeModel.TextFragment}.
		 *
		 * @readonly
		 * @property {treeModel.CharacterProxy} first
		 */
		this.first = startPosition.nodeAfter;

		/**
		 * Characters contained in {@link treeModel.TextFragment}.
		 *
		 * @readonly
		 * @property {String} text
		 */
		this.text = text;

		/**
		 * Last {@link treeModel.CharacterProxy character node} contained in {@link treeModel.TextFragment}.
		 *
		 * @readonly
		 * @property {treeModel.CharacterProxy} last
		 */
		this.last = this.getCharAt( this.text.length - 1 );

		/**
		 * List of attributes common for all characters in this {@link treeModel.TextFragment}.
		 *
		 * @readonly
		 * @property {@link treeModel.AttributeList} attrs
		 */
		this.attrs = this.first.attrs;
	}

	/**
	 * Gets a character at given index and creates a {@link treeModel.CharacterProxy} out of it.
	 *
	 * @param {Number} index Character index.
	 * @returns {treeModel.CharacterProxy}
	 */
	getCharAt( index ) {
		return this.first.parent.getChild( this.first._index + index );
	/**
	 * Checks if the text fragment has an attribute that is {@link treeModel.Attribute#isEqual equal} to given attribute or
	 * attribute with given key if string was passed.
	 *
	 * @param {treeModel.Attribute|String} attrOrKey Attribute or key of attribute to check.
	 * @returns {Boolean} `true` if given attribute or attribute with given key is set on text fragment, `false` otherwise.
	 */
	hasAttribute( attrOrKey ) {
		return this.first.hasAttribute( attrOrKey );
	}

	/**
	 * Gets a text fragment attribute by its key.
	 *
	 * @param {String} key Key of attribute to look for.
	 * @returns {treeModel.Attribute|null} Attribute with given key or null if the attribute has not been set on the text fragment.
	 */
	getAttribute( key ) {
		return this.first.getAttribute( key );
	}

	/**
	 * Gets a text fragment attribute value by attribute key.
	 *
	 * @param {String} key Key of attribute to look for.
	 * @returns {*} Value of attribute with given key or null if the attribute has not been set on the text fragment.
	 */
	getAttributeValue( key ) {
		return this.first.getAttributeValue( key );
	}

	/**
	 * Returns iterator that iterates over this text fragment's attributes.
	 *
	 * @returns {Iterable.<treeModel.Attribute>}
	 */
	getAttributes() {
		return this.first.getAttributes();
	}

	/**
	 * Sets attribute on the text fragment. If attribute with the same key already is set, it overwrites its values.
	 *
	 * To change attributes of nodes (also characters) that are attached to the tree model, you
	 * should use {@link treeModel.AttributeDelta}. This method is used by tree model internal mechanisms.
	 *
	 * @protected
	 * @param {treeModel.Attribute} attr Attribute to set or overwrite with.
	 */
	setAttribute( attr ) {
		// Do note that this changes attributes on whole NodeListText, not only on character nodes specified by
		// this TextFragment. Split NodeList at proper index before using this.
		this.first._nodeListText._attrs.set( attr );

		// Refreshing first and last character proxies because they would have wrong attributes.
		this.first = this.getCharAt( 0 );
		this.last = this.getCharAt( this.text.length - 1 );
	}

	/**
	 * Removes an attribute with given key from the text fragment.
	 *
	 * To change attributes of nodes (also characters) that are attached to the tree model, you
	 * should use {@link treeModel.AttributeDelta}. This method is used by tree model internal mechanisms.
	 *
	 * @protected
	 * @param {String} key Key of attribute to remove.
	 * @returns {Boolean} `true` if the attribute was set on the element, `false` otherwise.
	 */
	removeAttribute( key ) {
		// Do note that this changes attributes on whole NodeListText, not only on character nodes specified by
		// this TextFragment. Split NodeList at proper index before using this.
		let result = this.first._nodeListText._attrs.delete( key );

		// Refreshing first and last character proxies because they would have wrong attributes.
		this.first = this.getCharAt( 0 );
		this.last = this.getCharAt( this.text.length - 1 );

		return result;
	}
}
