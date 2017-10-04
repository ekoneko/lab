import * as React from 'react'
import {Editor, EditorState, RichUtils, Modifier, CompositeDecorator} from 'draft-js'
import styled from 'styled-components'
import 'draft-js/dist/Draft.css'

const EditorWrapper = styled.div`
    height: 200px;
    border: 1px solid #ccc;
`

const EditorToolbar = styled.div`
    //
`

const styleMap = {
    'CUSTOM': {
        textDecoration: 'line-through',
        color: 'gray',
    },
}

const ColorBlock = (props) => {
    const {color} = props.contentState.getEntity(props.entityKey).getData()
    return <span style={{color}}>{props.children}</span>
}

const findColorEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'COLOR'
            )
        },
        callback
    )
}

export interface IAppProps {}

export interface IAppState {
    editorState: any;
}

export default class App extends React.PureComponent<IAppProps, IAppState> {
    state = {
        editorState: EditorState.createEmpty(new CompositeDecorator([
            {
                strategy: findColorEntities,
                component: ColorBlock,
            },
        ]))
    }

    handleChange = (editorState) => {
        this.setState({editorState});
    }

    handleBoldClick = () => {
        this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    handleItalicClick = () => {
        this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    handleColorClick = () => {
        const contentState = this.state.editorState.getCurrentContent()
        const selection = this.state.editorState.getSelection()

        const contentStateWithEntity = contentState.createEntity(
            'COLOR',
            'MUTABLE',
            {color: prompt('Color', '#000')}
        )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()


        const nextContentState = Modifier.applyEntity(contentStateWithEntity, selection, entityKey)

        let nextEditorState = EditorState.set(
            this.state.editorState,
            {currentContent: nextContentState}
        )

        this.setState({editorState: nextEditorState})
    }

    handleFormatChange = (ev) => {
        const editorState: EditorState = RichUtils.toggleBlockType(this.state.editorState, ev.target.value)
        this.setState({editorState})
    }

    getBlockStyle = (block) => {
        switch (block.getType()) {
            case 'header-one':
                return 'RichEditor-h1'
        }
        return null
    }

    blockRenderer = (contentBlock) => {
        return null
    }

    render() {
        return (
            <div>
                <EditorToolbar>
                    <select onChange={this.handleFormatChange} defaultValue="unstyled">
                        <option value="unstyled">Normal</option>
                        <option value="header-one">H1</option>
                        <option value="header-two">H2</option>
                        <option value="header-three">H3</option>
                        <option value="header-four">H4</option>
                        <option value="header-five">H5</option>
                        <option value="header-six">H6</option>
                    </select>
                    <button onClick={this.handleBoldClick}>Bold</button>
                    <button onClick={this.handleItalicClick}>Italic</button>
                    <button onClick={this.handleColorClick}>Color</button>
                </EditorToolbar>
                <EditorWrapper>
                    <Editor
                        editorState={this.state.editorState}
                        customStyleMap={styleMap}
                        onChange={this.handleChange}
                        blockStyleFn={this.getBlockStyle}
                        blockRendererFn={this.blockRenderer}
                    />
                </EditorWrapper>
            </div>
        )
    }
}
